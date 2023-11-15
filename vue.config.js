const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const resolve = dir => path.resolve(__dirname, dir)
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
	publicPath: '/', // vue-cli3.3+,部署应用包时的基本 URL,用法和 webpack 本身的 output.publicPath 一致
	assetsDir: 'static', // 静态资源地址
	productionSourceMap: false,
	transpileDependencies: ['view-design', 'crypto-js'], // 解决在 ie 上无法访问的问题
	// scss 全局引入
	css: {
		extract: isProd, // 开发环境下关闭，true 和热更新不兼容，保证 css 热更新
		sourceMap: !isProd,
		loaderOptions: {
			sass: {
				// implementation: require('sass'),
				additionalData: `
                    @import "@/styles/common/_variables.scss";
                    @import "@/styles/common/_mixins.scss";
                `,
				sassOptions: {
					outputStyle: 'expanded',
				},
			},
		},
	},
	// 配置代理
	devServer: {
		// 配置代理
		open: true,
		hot: true,
		// port: 8081,
		proxy: {
			'/api/v2': {
				target: 'https://10.30.6.68/', // 目标代理接口地址
				// target: 'https://10.30.6.67/', // 目标代理接口地址
				changeOrigin: true,
				secure: false,
				header: {
					Referer: 'https://10.30.6.68/',
					// Referer: 'https://10.30.6.67/',
				},
			},
			// 图片跨域、 pdf查看
			'/media/': {
				target: 'https://10.30.6.68/', // 目标代理接口地址
				// target: ' https://10.30.6.67/', // 目标代理接口地址
				changeOrigin: false,
				secure: false,
			},
		},
	},
	chainWebpack: config => {
		// 修复HMR
		config.resolve.symlinks(true)

		// 根据 js 版本配置文件修改 index.html 文件中的产品名称
		config.plugin('html').tap(options => {
			options[0].title = '自定义大屏'

			return options
		})

		return config
	},
	// 配置 webpack
	configureWebpack: config => {
		// 路径别名
		config.resolve.alias = {
			...config.resolve.alias,
			'@assets': resolve('src/assets'),
			'@styles': resolve('src/styles'),
			'@services': resolve('src/services'),
			'@router': resolve('src/router'),
			'@store': resolve('src/store'),
			'@components': resolve('src/components'),
			'@views': resolve('src/views'),
			'@scripts': resolve('src/scripts'),
			'@constants': resolve('src/constants'),
			'@mixins': resolve('src/scripts/mixins'),
			'@utils': resolve('src/scripts/utils'),
		}

		// 添加对 pdf 文件的处理 loader
		config.module.rules = [
			...config.module.rules,
			{
				test: /\.pdf$/,
				use: 'url-loader',
			},
		]

		// gzip 压缩
		if (isProd) {
			config.plugins = [
				...config.plugins,
				new CompressionWebpackPlugin({
					filename: '[path].gz[query]',
					algorithm: 'gzip',
					test: /\.(js|css|html|svg)(\?.*)?$/i,
					threshold: 10240,
					minRatio: 0.8,
				}),
			]
		} else {
			// 生成可调试的代码
			config.output.devtoolModuleFilenameTemplate = info => {
				const resPath = info.resourcePath

				if (
					(/\.vue$/.test(resPath) &&
						!/type=script/.test(info.identifier)) ||
					/node_modules/.test(resPath)
				) {
					return `webpack:///${resPath}?${info.hash}`
				}
				return `webpack:///${resPath.replace(
					'./src',
					'uncompiled-code/src'
				)}`
			}
		}
	},
}
