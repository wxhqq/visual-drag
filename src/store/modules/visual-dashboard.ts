import {
	VuexModule,
	Module,
	Mutation,
	getModule,
	config,
} from 'vuex-module-decorators'
import store from '../index'

import {
	FieldType,
	AggregateType,
	SortType,
} from '@/views/custom-visual/screen-edit/scripts/visual-type'
// Set rawError to true by default on all @Action decorators
config.rawError = true

// 组件模板
const componentTemplate = {
	guid: '', //唯一标识码
	label: '',
	component: '',
	wrapStyle: {},
	attrStyle: {},
	dataConfigs: {
		dimensions: [],
		measures: [],
		sorts: [],
		filters: [],
	},
}

// dashboard中组件类型
export interface BiComponent {
	guid: string //唯一标识码
	label: string
	component: string
	x: number
	y: number
	w: number
	h: number
	i: string
	wrapStyle?: {
		showTitle: boolean
		cardBgColor: string
	}
	attrStyle: Record<string, any>
	propStyle: Record<string, number> //定义了但未使用，主要在大屏中使用
	dataConfigs: {
		dimensions: {
			field: string //字段
			fieldType: FieldType
			sort: SortType
		}[]
		measures: {
			field: string //字段
			fieldType: FieldType
			aggregate: AggregateType
			sort: SortType
		}[]
		filters: {
			field: string
			fieldType: FieldType
			// TODO 后续扩展
			filterType: string
		}[]
		autoRefresh: boolean //是否自动刷新
		refreshRate: number
		unit: 'second' | 'minute' //秒:second，分:minute
		resultNum: number //展示结果
	}
}

@Module({ dynamic: true, store, name: 'visualDashboard', namespaced: true })
class VisualDashboard extends VuexModule {
	// 主题设置
	themeOptions = {
		title: '仪表盘-未命名',
		skin: 'light', //皮肤 深色  浅色
		backgroundColor: '#f2f3f8', //默认
		backgroundImg: '', //背景图片叠加
		cardRadius: 6, //卡片圆角  6/12
		cardGap: 8, //  8/16
		colorType: '1',
	}

	// 拖拽添加组件参数
	dragAddInfos = {
		isDragging: false,
		mouseX: 0,
		mouseY: 0,
		nodeInfo: {},
	}

	// 已添加的所有组件
	allAddedComponents: BiComponent[] = []

	// 添加后激活的组件（选中， 右侧显示相应的属性）
	activeComponent: BiComponent = JSON.parse(JSON.stringify(componentTemplate))

	/**
	 * ********************************更新缓存数据*****************************************
	 * @param options
	 */
	@Mutation
	updateData(options: { key: string | number; data: unknown }) {
		this[options.key] = options.data
	}

	/**
	 * ********************************组件操作*****************************************
	 *
	 * 添加单个组件
	 */
	@Mutation
	addNewComponent({
		data,
		index = -1,
	}: {
		data: BiComponent
		index?: number
	}) {
		if (data.hasOwnProperty('wrapStyle')) {
			data.label += '-未命名'
		}
		if (data?.attrStyle?.hasOwnProperty('colorType')) {
			data.attrStyle['colorType'] = this.themeOptions.colorType
		}

		if (index === -1) {
			this.allAddedComponents.push(data)
		} else {
			this.allAddedComponents.splice(index, 0, data)
		}
		if (data.component) {
			this.activeComponent = data
		}
	}

	/**
	 * 删除组件
	 */
	@Mutation
	deleteComponent(guid = this.activeComponent.guid) {
		if (!guid) return
		this.allAddedComponents = this.allAddedComponents.filter(
			item => item.guid !== guid
		)
		if (guid === this.activeComponent.guid) {
			this.activeComponent = JSON.parse(JSON.stringify(componentTemplate))
		}
	}

	/**
	 * 重置激活组件
	 */
	@Mutation
	resetActiveComponent() {
		if (this.activeComponent.component) {
			this.activeComponent = JSON.parse(JSON.stringify(componentTemplate))
		}
	}
}
export default getModule(VisualDashboard)
