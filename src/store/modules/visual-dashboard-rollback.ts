import {
	VuexModule,
	Module,
	Mutation,
	getModule,
	config,
} from 'vuex-module-decorators'
import store from '../index'

import VisualDashboardStore from './visual-dashboard'
// Set rawError to true by default on all @Action decorators
config.rawError = true

// 最大保存次数
const maxStep = 20

@Module({
	dynamic: true,
	store,
	name: 'visualDashboardRollback',
	namespaced: true,
})
class VisualDashboardRollback extends VuexModule {
	// 初始记录 页面刷新时记录
	rollbackList: {
		componnents: string
		pageOption: string
	}[] = [] //回滚列表
	curIndex = -1 //当前回滚索引

	@Mutation
	pushRecord() {
		// 当前历史记录的长度
		const curLength = this.rollbackList.length
		if (this.curIndex !== curLength - 1) {
			// 用户存在撤销后， 又进行新的操作，则删除当前回滚索引后的历史记录
			this.rollbackList.splice(this.curIndex + 1)
		}

		this.rollbackList.push({
			componnents: JSON.stringify(
				VisualDashboardStore.allAddedComponents
			),
			pageOption: JSON.stringify(VisualDashboardStore.themeOptions),
		})

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
		const rollData = this.rollbackList[this.curIndex]

		if (!rollData) return
		VisualDashboardStore.updateData({
			key: 'allAddedComponents',
			data: JSON.parse(rollData.componnents),
		})
		VisualDashboardStore.updateData({
			key: 'themeOptions',
			data: JSON.parse(rollData.pageOption),
		})
		VisualDashboardStore.resetActiveComponent()
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
		const rollData = this.rollbackList[this.curIndex]

		if (!rollData) return
		VisualDashboardStore.updateData({
			key: 'allAddedComponents',
			data: JSON.parse(rollData.componnents),
		})
		VisualDashboardStore.updateData({
			key: 'themeOptions',
			data: JSON.parse(rollData.pageOption),
		})
		VisualDashboardStore.resetActiveComponent()
	}
}
export default getModule(VisualDashboardRollback)
