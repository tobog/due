const NODE_ENV = process.env.NODE_ENV;
// const isPord = NODE_ENV === 'production';
const isDev = NODE_ENV === 'development';
const isDemo = NODE_ENV === 'demo';

const config = {
    development: {
        app: {
            entry: "./demo/main.js",
            chunks: ['chunk-vendors', 'chunk-common', 'app'],
            template: 'public/index.html',
            filename: 'index.html',
        }
    },
    demo: {
        demo: {
            entry: "./demo/main.js",
            chunks: ['chunk-vendors', 'chunk-common', 'demo'],
            template: 'public/index.html',
            filename: 'index.html',
        }
    },
}
if (isDemo) process.env.NODE_ENV = "production";
module.exports = {
    assetsDir: "./static",
    publicPath: "./",
    lintOnSave: false,
    runtimeCompiler: true,
    devServer: {
        clientLogLevel: "warning",
        inline: true,
        hot: true,
        open: true,
        overlay: { warnings: false, errors: true }
    },
    pages: config[NODE_ENV],
    configureWebpack: {
        performance: {
            hints: false
        },
        devtool: isDev ? 'eval-source-map' : 'none'
    },
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('prefetch')
        // 移除 preload 插件
        config.plugins.delete('preload');
    }
}


// 1. 微信授权首次打点未发送微信用户信息给伏析  0.5
// 2. 【冷启动页面】启动逻辑+页面优化 2.5
// 3. 【公司资料】小程序承载 1.5
// 4. 【全员推广】调用鲁班接口更换 1.0
// 5. 【全员推广】持续优化 小程序 + web 2
// 总计： 8.5