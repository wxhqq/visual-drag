import {
	VuexModule,
	Module,
	Mutation,
	getModule,
	config,
} from 'vuex-module-decorators'
import store from '../index'

import VisualScreenStore from './visual-screen'
// Set rawError to true by default on all @Action decorators
config.rawError = true

// 最大保存次数
const maxStep = 20

@Module({
	dynamic: true,
	store,
	name: 'VisualScreenRollback',
	namespaced: true,
})
class VisualScreenRollback extends VuexModule {
	// 初始记录 页面刷新时记录
	rollbackList: string[] = [] //回滚列表
	curIndex = -1 //当前回滚索引

	@Mutation
	pushRecord() {
		// 当前历史记录的长度
		const curLength = this.rollbackList.length
		if (this.curIndex !== curLength - 1) {
			// 用户存在撤销后， 又进行新的操作，则删除当前回滚索引后的历史记录
			this.rollbackList.splice(this.curIndex + 1)
		}

		const strData = JSON.stringify(VisualScreenStore.allAddedComponents)
		this.rollbackList.push(strData)
		if (this.curIndex < maxStep - 1) {
			this.curIndex++
		} else {
			this.rollbackList.shift()
		}
	}

	// 撤销
	@Mutation
	undo() {
		if (this.curIndex === 0) return

		if (this.curIndex > 0) {
			this.curIndex--
		}
		const strData = this.rollbackList[this.curIndex]

		if (!strData) return
		VisualScreenStore.updateData({
			key: 'allAddedComponents',
			data: JSON.parse(strData),
		})
		VisualScreenStore.resetActiveComponent()
	}
	// 重做
	@Mutation
	redo() {
		const { length } = this.rollbackList
		if (!length || this.curIndex >= length - 1) {
			return
		}

		if (this.curIndex < length - 1) {
			this.curIndex++
		}
		const strData = this.rollbackList[this.curIndex]
		if (!strData) return
		VisualScreenStore.updateData({
			key: 'allAddedComponents',
			data: JSON.parse(strData),
		})
		VisualScreenStore.resetActiveComponent()
	}
}
export default getModule(VisualScreenRollback)
