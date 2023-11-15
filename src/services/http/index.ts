/**
 * @description 对 api-methods 文件夹下的所有请求方法进行整合并注册到 Vue
 */

let apis = {}

// 扫描模块

const apiContext = require.context('./api-methods', true, /(.js)|(.ts)$/)

apiContext.keys().forEach(apiPath => {
	const apiModule = apiContext(apiPath)
	// 兼容 import export 和 require module.export 两种规范
	apis = {
		...apis,
		...(apiModule.default || apiModule),
	}
})

// 导出
export const $apis = apis
