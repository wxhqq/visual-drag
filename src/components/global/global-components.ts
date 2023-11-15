import Vue from 'vue'

// context 是 webapck 中作为解析模块的基础路径
const componentsContext = require.context(
	// 其组件目录的相对路径
	'./',
	// 是否查询其子目录
	false,
	// 搜索所有 vue 文件
	/[A-Z]\w+\.(vue)$/
)

// keys() 是匹配到的文件相对路径列表
componentsContext.keys().forEach(componentPath => {
	// 根据 path 获取相应的组件信息
	const componentConfig = componentsContext(componentPath)
	// 如果组件有配置 name 选项，那么使用 name 选项作为组件名；如果没有，使用匹配到的文件名作为组件名称
	const componentName = componentPath
		.split('/')
		.pop()
		?.replace(/\.\w+$/, '') // 例：./BoleanButton.vue -> BoleanButton
	// 全局注册组件
	componentName &&
		Vue.component(componentName, componentConfig.default || componentConfig) // （组件名，配置信息）
})
