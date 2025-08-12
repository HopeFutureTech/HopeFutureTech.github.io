#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 版本管理配置
const VERSION_CONFIG = {
    version: '1.0.0',
    buildTime: new Date().toISOString().split('T')[0]
};

// 需要添加版本控制的文件类型
const VERSIONED_EXTENSIONS = ['.css', '.js', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico'];

// 获取文件列表
function getFiles(dir, extensions) {
    const files = [];
    
    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                traverse(fullPath);
            } else if (stat.isFile()) {
                const ext = path.extname(item).toLowerCase();
                if (extensions.includes(ext)) {
                    files.push(fullPath);
                }
            }
        }
    }
    
    traverse(dir);
    return files;
}

// 更新版本控制文件
function updateVersionFile() {
    const versionContent = `// 版本控制配置
const VERSION_CONFIG = {
    // 当前版本号
    version: '${VERSION_CONFIG.version}',
    
    // 构建时间戳
    buildTime: '${VERSION_CONFIG.buildTime}',
    
    // 静态资源版本映射
    assets: {
        // CSS文件
        'css/font-awesome.min.css': '${VERSION_CONFIG.version}',
        
        // JavaScript文件
        'js/i18n.js': '${VERSION_CONFIG.version}',
        'js/language-switcher.js': '${VERSION_CONFIG.version}',
        'js/version.js': '${VERSION_CONFIG.version}',
        
        // 图片资源
        'imgs/xiwangxue.webp': '${VERSION_CONFIG.version}',
        'imgs/xiwangsuyang.webp': '${VERSION_CONFIG.version}',
        'imgs/xiwangyouke.jpeg': '${VERSION_CONFIG.version}',
        'imgs/xueersi.png': '${VERSION_CONFIG.version}',
        'imgs/xueersiwagxiao.webp': '${VERSION_CONFIG.version}',
        'imgs/yingyujiao.png': '${VERSION_CONFIG.version}',
        
        // 图标文件
        'favicon.png': '${VERSION_CONFIG.version}',
        'favicon.svg': '${VERSION_CONFIG.version}'
    }
};

// 获取资源URL（带版本号）
function getAssetUrl(path) {
    const version = VERSION_CONFIG.assets[path] || VERSION_CONFIG.version;
    return \`\${path}?v=\${version}\`;
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
}`;

    fs.writeFileSync('js/version.js', versionContent);
    console.log('✅ 版本控制文件已更新');
}

// 主函数
function main() {
    console.log('🚀 开始构建...');
    console.log(`📦 版本: ${VERSION_CONFIG.version}`);
    console.log(`📅 构建时间: ${VERSION_CONFIG.buildTime}`);
    
    // 更新版本控制文件
    updateVersionFile();
    
    console.log('✅ 构建完成！');
    console.log('\n📝 使用说明:');
    console.log('1. 修改 build.js 中的 VERSION_CONFIG.version 来更新版本号');
    console.log('2. 运行 node build.js 来重新构建');
    console.log('3. 所有静态资源都会自动添加版本号参数');
}

// 运行构建
if (require.main === module) {
    main();
}

module.exports = { VERSION_CONFIG, updateVersionFile }; 