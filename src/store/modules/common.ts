import {
	VuexModule,
	Module,
	Mutation,
	Action,
	getModule,
	config,
} from 'vuex-module-decorators'
import store from '../index'
// Set rawError to true by default on all @Action decorators
config.rawError = true

/**
 * 通用设置 用户相关、主题、左侧菜单等
 */

@Module({
	dynamic: true,
	store,
	name: 'commonStore',
	namespaced: true,
	preserveState: localStorage.getItem('vuex') !== null,
})
class commonStore extends VuexModule {
	theme: 'green' | 'blue' = 'blue' // 主题色 green,blue,默认 green
	background: 'light' | 'dark' = 'light' // 深浅色背景 light,dark
	isMenuOpen = true // 菜单是否已打开

	// ----------------------  主题  -----------------------------------
	// 初始化主题和背景设置
	@Action
	initAppearance() {
		window.document.documentElement.setAttribute('data-theme', this.theme)
		window.document.documentElement.setAttribute(
			'data-background',
			this.background
		)
	}
	/**
	 * ********************************更新缓存数据*****************************************
	 * @param options
	 */
	@Mutation
	updateData(options: { key: string | number; data: unknown }) {
		this[options.key] = options.data
	}
}
export default getModule(commonStore)
