// 版本控制配置
const VERSION_CONFIG = {
    // 当前版本号
    version: '1.0.0',
    
    // 构建时间戳
    buildTime: '2025-01-27',
    
    // 静态资源版本映射
    assets: {
        // CSS文件
        'css/font-awesome.min.css': 'v1.0.0',
        
        // JavaScript文件
        'js/i18n.js': 'v1.0.0',
        'js/language-switcher.js': 'v1.0.0',
        
        // 图片资源
        'imgs/xiwangxue.webp': 'v1.0.0',
        'imgs/xiwangsuyang.webp': 'v1.0.0',
        'imgs/xiwangyouke.jpeg': 'v1.0.0',
        'imgs/xueersi.png': 'v1.0.0',
        'imgs/xueersiwagxiao.webp': 'v1.0.0',
        'imgs/yingyujiao.png': 'v1.0.0',
        
        // 图标文件
        'favicon.png': 'v1.0.0',
        'favicon.svg': 'v1.0.0'
    }
};

// 获取资源URL（带版本号）
function getAssetUrl(path) {
    const version = VERSION_CONFIG.assets[path] || VERSION_CONFIG.version;
    return `${path}?v=${version}`;
}

// 获取当前版本号
function getVersion() {
    return VERSION_CONFIG.version;
}

// 获取构建时间
function getBuildTime() {
    return VERSION_CONFIG.buildTime;
}

// 导出到全局作用域
if (typeof window !== 'undefined') {
    window.VERSION_CONFIG = VERSION_CONFIG;
    window.getAssetUrl = getAssetUrl;
    window.getVersion = getVersion;
    window.getBuildTime = getBuildTime;
} 