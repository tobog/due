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