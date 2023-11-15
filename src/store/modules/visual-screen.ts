import {
	VuexModule,
	Module,
	Mutation,
	getModule,
	config,
} from 'vuex-module-decorators'
import store from '../index'

// 性能更高
import { filter } from 'lodash-es'
import { traverseComponent } from '@/views/custom-visual/screen-edit/scripts/utils'

// Set rawError to true by default on all @Action decorators
config.rawError = true

// 组件模板
const componentTemplate = {
	guid: '', //唯一标识码
	label: '',
	component: '',
	pGuid: '', //父组件id
	isLock: false, //是否锁定
	isShow: true, //是否显示
	level: '', //组件层级
	expanded: false, //是否展开
	propStyle: {
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	},
	attrStyle: {},
}

// 大屏中组件类型
export interface ScreenComponent {
	guid: string //唯一标识码
	label: string
	component: string
	children?: ScreenComponent[]
	pGuid: string //父组件id
	isLock: boolean //是否锁定
	isShow: boolean //是否显示
	level: string //组件层级
	expanded: boolean //是否展开
	propStyle: {
		top: number
		left: number
		width: number
		height: number
	}
	attrStyle: Record<string, any>
}
// 样式类
type styleTyps = {
	top: number
	left: number
	width: number
	height: number
}

@Module({ dynamic: true, store, name: 'VisualScreenStore', namespaced: true })
class VisualScreenStore extends VuexModule {
	// 画布缩放比例
	canvasScale = 1
	// 按住空格按钮  可拖动画布， 禁用其他事件
	holdSpace = false
	// 按住ctrl 可以多选组件
	holdCtrl = false
	// 已添加的所有组件
	allAddedComponents: ScreenComponent[] = []

	// 添加后激活的组件（选中， 右侧显示相应的属性）
	activeComponent: ScreenComponent = JSON.parse(
		JSON.stringify(componentTemplate)
	)

	// 组件是否处于拖拽状态
	isComponentDragging = false

	// 框选中的组件
	selectedDatas: {
		isShow: boolean
		areaComponents: ScreenComponent[]
		areaStyle: styleTyps
	} = {
		isShow: false,
		areaComponents: [],
		areaStyle: {
			top: 0,
			left: 0,
			width: 0,
			height: 0,
		},
	}

	// 右击菜单信息
	contextInfo = {
		isShow: false,
		top: '0',
		left: '0',
	}

	/**
	 * ********************************更新缓存数据*****************************************
	 * @param options
	 */
	@Mutation
	updateData(options: { key: string | number; data: unknown }) {
		this[options.key] = options.data
	}

	/**
	 *更新框选区数据
	 */
	@Mutation
	updateSelectDates(data: {
		isShow?: boolean
		areaComponents?: ScreenComponent[]
		areaStyle?: styleTyps
	}) {
		Object.assign(this.selectedDatas, data)
	}
	/**
	 *隐藏选择框
	 */
	@Mutation
	hideSelectArea() {
		this.selectedDatas = {
			isShow: false,
			areaComponents: [],
			areaStyle: {
				top: 0,
				left: 0,
				width: 0,
				height: 0,
			},
		}
	}
	/**
	 * ********************************组件操作*****************************************
	 *
	 * 添加单个组件
	 */
	@Mutation
	addNewComponent({
		data,
		tagetList,
		index = -1,
	}: {
		data: ScreenComponent
		tagetList?: ScreenComponent[] | undefined
		index?: number
	}) {
		tagetList = tagetList || this.allAddedComponents
		if (index < 0) {
			tagetList.push(data)
		} else {
			tagetList.splice(index, 0, data)
		}
		this.activeComponent = data
	}
	/**
	 * 批量添加组件
	 */
	@Mutation
	batchAddNewComponent({
		data, //插入数据
		tagetList, //插入目标group
		index, //插入位置
	}: {
		data: ScreenComponent[]
		tagetList?: ScreenComponent[] | undefined
		index?: number
	}) {
		tagetList = tagetList || this.allAddedComponents
		if (index === undefined) {
			tagetList.push(...data)
		} else {
			tagetList.splice(index, 0, ...data)
		}
		data[0] && (this.activeComponent = data[0])
	}
	/**
	 * 删除组件
	 */
	@Mutation
	deleteComponent(guid = this.activeComponent.guid) {
		if (!guid) return
		const recurisiveFilter = (componentList: ScreenComponent[]) => {
			return filter(componentList, item => {
				if (item.children) {
					item.children = recurisiveFilter(item.children)
				}
				return item.guid !== guid
			})
		}
		this.allAddedComponents = recurisiveFilter(this.allAddedComponents)

		this.activeComponent = JSON.parse(JSON.stringify(componentTemplate))
	}
	/**
	 * 修改当前组件的style
	 */
	@Mutation
	setActiveShapeStyle(style: {}) {
		this.activeComponent.component &&
			Object.assign(this.activeComponent['propStyle'], style)
	}
	/**
	 * 修改当前组件的grid style
	 */
	@Mutation
	setActiveGridStyle(style: {}) {
		this.activeComponent.component &&
			Object.assign(this.activeComponent, style)
	}
	/**
	 * 修改当前组件的label
	 */
	@Mutation
	setComponentLabel(label: string) {
		this.activeComponent.label = label
	}
	/**
	 * 修改当前组件的属性
	 */
	@Mutation
	setComponentAttr(data: { isLock?: boolean; isShow?: boolean }) {
		const { children } = this.activeComponent
		if (children) {
			//组合内都进行同样的操作
			traverseComponent(children, item => {
				Object.assign(item, data)
			})
		}
		Object.assign(this.activeComponent, data)
	}
	/**
	 * 批量修改组件的属性   锁定、显示
	 */
	@Mutation
	batchSetComponentAttr({
		guidList,
		data,
	}: {
		guidList: string[]
		data: { isLock?: boolean; isShow?: boolean }
	}) {
		traverseComponent(this.allAddedComponents, item => {
			if (guidList.includes(item.guid)) {
				Object.assign(item, data)
				if (item.children) {
					//组合内都进行同样的操作
					traverseComponent(item.children, ele => {
						Object.assign(ele, data)
					})
				}
			}
		})
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
export default getModule(VisualScreenStore)
