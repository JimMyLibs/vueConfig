// vue.config.js
const path = require('path');
const projectConf = require('../src/config/project');

// 生成目录
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = (config) => {
    config
        .plugin('env')
        .use(require.resolve('webpack/lib/EnvironmentPlugin'), [{
            'PROJECT_INFO': JSON.stringify({
                ...projectConf,
            })
        }]);
    config.resolve.alias
        .set('comm', resolve('./src/comm'))
        .set('config', resolve('./src/config'))
}