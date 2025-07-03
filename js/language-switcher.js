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
    
    // 设置HTML语言属性
    document.documentElement.lang = currentLang;
    
    // 更新语言选择器显示
    updateLanguageDisplay();
    
    // 初始化页面文本
    translatePage();
    
    // 绑定语言切换事件
    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const newLang = btn.getAttribute('data-lang');
            console.log('Language switch clicked:', newLang);
            switchLanguage(newLang);
        });
    });
});

// 切换语言
function switchLanguage(newLang) {
    console.log('Switching language from', currentLang, 'to', newLang);
    if (newLang && i18n[newLang]) {
        currentLang = newLang;
        localStorage.setItem('preferred_language', newLang);
        document.documentElement.lang = newLang;
        updateLanguageDisplay();
        translatePage();
        console.log('Language switch completed');
    } else {
        console.error('Invalid language or translations not found for:', newLang);
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
    console.log('Starting page translation...');
    let translatedCount = 0;
    let errorCount = 0;
    
    // 翻译所有带data-i18n属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
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
            } catch (error) {
                console.error('Error translating element:', element, 'with key:', key, error);
                errorCount++;
            }
        } else {
            console.warn('Translation not found for key:', key);
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