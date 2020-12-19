const NODE_ENV = process.env.NODE_ENV;

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
            chunks: ['chunk-vendors', 'chunk-common']
        }
    },
}
module.exports = {
    assetsDir: "./static",
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
        }
    },

}