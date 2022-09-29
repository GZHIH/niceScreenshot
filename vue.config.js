const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';
const webpack = require('webpack');

const AntDesignIconsPath = './build/antdv-icons.js';

module.exports = {
    outputDir: 'dist',
    // 自定义html模板cpoy后目标的路径(相对 outputDir 的路径)或者修改文件名字、后缀
    indexPath: './index.ftl',
    // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    assetsDir: './assets',
    publicPath: isProduction ? '' : '',
    // babel-loader 打包时强制重新编译打包某些依赖
    transpileDependencies: ['ant-design-vue'],
    productionSourceMap: false,
    // 不使用 eslint 检查
    lintOnSave: false,
    configureWebpack: {
        plugins: [
            // moment 打包体积优化
            // new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
        ],
        resolve: {
            // 创建 import 或 require 的别名，来确保模块引入变得更简单，引入的时候可以不写相对路径
            alias: {
                // antd 打包体积优化，去掉不需要的icons
                '@ant-design/icons/lib/dist$': path.resolve(__dirname, AntDesignIconsPath),
            },
        },
        externals: {},
    },
    chainWebpack: (config) => {
        // 设置路径别名
        config.resolve.alias.set('@', path.resolve(__dirname, './src')).set('@comB', '@/components/business').set('@comC', '@/components/common');

        // 打包html文件关闭压缩
        config.plugin('html').tap((args) => {
            args[0].mminify = false;
            return args;
        });

        // 将svg文件剔除最终打包体积
        const svgRule = config.module.rule('svg');
        svgRule.uses.clear();
        svgRule.use('url-loader').loader('url-loader');
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://gzh.com',
                ws: true,
                changeOrigin: true,
            },
        },
    },
};
