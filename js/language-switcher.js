// 默认语言
let currentLang = localStorage.getItem('preferred_language') || 'zh-TW';

// 确保i18n对象存在
if (typeof i18n === 'undefined') {
    console.error('i18n object is not defined. Make sure i18n.js is loaded before language-switcher.js');
}

// 初始化语言
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded, initializing language system...');
    console.log('Current language:', currentLang);
    console.log('i18n object available:', typeof i18n !== 'undefined');
    
    // 设置HTML语言属性
    document.documentElement.lang = currentLang;
    
    // 更新语言选择器显示
    updateLanguageDisplay();
    
    // 初始化页面文本
    translatePage();
    
    // 绑定语言切换事件
    const langButtons = document.querySelectorAll('[data-lang]');
    console.log('Found language buttons:', langButtons.length);
    
    langButtons.forEach((btn, index) => {
        console.log(`Binding event to button ${index}:`, btn.getAttribute('data-lang'));
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const newLang = btn.getAttribute('data-lang');
            console.log('Language switch clicked:', newLang);
            switchLanguage(newLang);
            // 隐藏下拉菜单
            hideLangDropdown();
        });
    });
    
    // 绑定下拉菜单切换事件
    const langToggle = document.getElementById('lang-toggle');
    console.log('Language toggle button found:', !!langToggle);
    if (langToggle) {
        langToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Language toggle clicked');
            toggleLangDropdown();
        });
    } else {
        console.error('Language toggle button not found');
    }
    
    // 点击其他地方隐藏下拉菜单
    document.addEventListener('click', (e) => {
        const langToggle = document.getElementById('lang-toggle');
        const dropdown = document.getElementById('lang-dropdown');
        if (!langToggle?.contains(e.target) && !dropdown?.contains(e.target)) {
            hideLangDropdown();
        }
    });
});

// 切换下拉菜单显示状态
function toggleLangDropdown() {
    const dropdown = document.getElementById('lang-dropdown');
    console.log('Dropdown element found:', !!dropdown);
    if (dropdown) {
        const isHidden = dropdown.classList.contains('hidden');
        console.log('Dropdown is hidden:', isHidden);
        if (isHidden) {
            dropdown.style.display = 'block';
            dropdown.classList.remove('hidden');
            console.log('Dropdown shown');
        } else {
            dropdown.style.display = 'none';
            dropdown.classList.add('hidden');
            console.log('Dropdown hidden');
        }
    } else {
        console.error('Dropdown element not found');
    }
}

// 隐藏下拉菜单
function hideLangDropdown() {
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) {
        dropdown.style.display = 'none';
        dropdown.classList.add('hidden');
    }
}

// 切换语言
function switchLanguage(newLang) {
    console.log('Switching language from', currentLang, 'to', newLang);
    console.log('i18n object available:', typeof i18n !== 'undefined');
    console.log('i18n keys:', Object.keys(i18n));
    console.log('Target language available:', i18n[newLang] ? 'Yes' : 'No');
    
    if (newLang && i18n[newLang]) {
        currentLang = newLang;
        localStorage.setItem('preferred_language', newLang);
        document.documentElement.lang = newLang;
        updateLanguageDisplay();
        translatePage();
        console.log('Language switch completed');
    } else {
        console.error('Invalid language or translations not found for:', newLang);
        if (i18n[newLang]) {
            console.log('Available keys in', newLang, ':', Object.keys(i18n[newLang]));
        }
    }
}

// 更新语言选择器显示
function updateLanguageDisplay() {
    const langNames = {
        'zh-CN': '简体中文',
        'zh-TW': '繁體中文',
        'en-US': 'English'
    };
    const currentLangDisplay = document.getElementById('current-lang');
    if (currentLangDisplay) {
        currentLangDisplay.textContent = langNames[currentLang];
        console.log('Updated language display to:', langNames[currentLang]);
    } else {
        console.error('Language display element not found');
    }
}

// 更新图表
function updateCharts() {
    console.log('Updating charts...');
    try {
        // 更新销售趋势图表
        if (window.salesChart && window.salesChart.data) {
            console.log('Updating sales chart...');
            window.salesChart.data.labels = [
                i18n[currentLang].chart_month_1,
                i18n[currentLang].chart_month_2,
                i18n[currentLang].chart_month_3,
                i18n[currentLang].chart_month_4,
                i18n[currentLang].chart_month_5,
                i18n[currentLang].chart_month_6,
                i18n[currentLang].chart_month_7,
                i18n[currentLang].chart_month_8,
                i18n[currentLang].chart_month_9,
                i18n[currentLang].chart_month_10,
                i18n[currentLang].chart_month_11,
                i18n[currentLang].chart_month_12
            ];
            window.salesChart.data.datasets[0].label = i18n[currentLang].chart_sales_unit;
            window.salesChart.update();
            console.log('Sales chart updated successfully');
        } else {
            console.log('Sales chart not initialized yet');
        }
        
        // 更新地域分布图表
        if (window.geoChart && window.geoChart.data) {
            console.log('Updating geo chart...');
            window.geoChart.data.labels = [
                i18n[currentLang].chart_region_1,
                i18n[currentLang].chart_region_2,
                i18n[currentLang].chart_region_3,
                i18n[currentLang].chart_region_4,
                i18n[currentLang].chart_region_5,
                i18n[currentLang].chart_region_6,
                i18n[currentLang].chart_region_7
            ];
            window.geoChart.update();
            console.log('Geo chart updated successfully');
        } else {
            console.log('Geo chart not initialized yet');
        }
    } catch (error) {
        console.error('Error updating charts:', error);
    }
}

// 翻译页面内容
function translatePage() {
    console.log('Starting page translation for language:', currentLang);
    let translatedCount = 0;
    let errorCount = 0;
    
    // 翻译所有带data-i18n属性的元素
    const elements = document.querySelectorAll('[data-i18n]');
    console.log('Found elements to translate:', elements.length);
    
    elements.forEach((element, index) => {
        const key = element.getAttribute('data-i18n');
        console.log(`Translating element ${index}:`, key);
        
        if (i18n[currentLang] && i18n[currentLang][key]) {
            try {
                // 对于input和textarea，更新placeholder
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = i18n[currentLang][key];
                }
                // 对于select的option元素
                else if (element.tagName === 'OPTION') {
                    element.textContent = i18n[currentLang][key];
                }
                // 对于其他元素，更新内容
                else {
                    element.textContent = i18n[currentLang][key];
                }
                translatedCount++;
                console.log(`Successfully translated: ${key}`);
            } catch (error) {
                console.error('Error translating element:', element, 'with key:', key, error);
                errorCount++;
            }
        } else {
            console.warn('Translation not found for key:', key, 'in language:', currentLang);
            errorCount++;
        }
    });
    
    console.log(`Translation completed. Translated: ${translatedCount}, Errors: ${errorCount}`);
    
    // 更新页面标题
    if (i18n[currentLang] && i18n[currentLang]['page_title']) {
        document.title = i18n[currentLang]['page_title'];
        console.log('Page title updated');
    }
    
    // 更新图表
    updateCharts();
    
    // 触发自定义事件
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: currentLang } }));
    console.log('Language change event dispatched');
}

// 导出函数供其他模块使用
window.switchLanguage = switchLanguage;
window.getCurrentLanguage = () => currentLang; 