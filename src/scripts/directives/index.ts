import { VueConstructor } from 'vue/types/vue'

// context 是 webapck 中作为解析模块的基础路径
const directivesContext = require.context('./', true, /(.js)|(.ts)$/)
// keys() 是匹配到的文件相对路径列表
export default {
	install(Vue: VueConstructor) {
		directivesContext.keys().forEach(componentPath => {
			// 根据 path 获取相应的指令信息
			const componentConfig = directivesContext(componentPath)
			// 如果指令有配置 name 选项，那么使用 name 选项作为指令名；如果没有，使用匹配到的文件名作为指令名称
			const directiveName = componentPath
				.split('/')
				.pop()
				?.replace(/\.\w+$/, '') // 例：./BoleanButton.vue -> BoleanButton
			// 全局注册指令
			if (directiveName && directiveName !== 'index') {
				Vue.directive(
					directiveName,
					componentConfig.default || componentConfig
				) // （指令名，配置信息）
			}
		})
	},
}
