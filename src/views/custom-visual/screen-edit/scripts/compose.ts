import VisualScreenStore, {
	ScreenComponent,
} from '@/store/modules/visual-screen'
import { getComponentToGroupPostion } from './calculate-util'
import { findComponent, findComponentIndex, generateGuid } from './utils'

/**
 * 单个组件成组
 */
export const composeSingleComponent = () => {
	const { propStyle, guid, pGuid, ...others } =
		VisualScreenStore.activeComponent
	const groupGuid = generateGuid()

	const groupComponent = {
		guid: groupGuid,
		component: 'Vgroup',
		label: '组合',
		// label: `组合-${Date.now()}`,
		pGuid: pGuid,
		isLock: false,
		isShow: true,
		level: '',
		expanded: true,
		propStyle: { ...propStyle },
		attrStyle: {},
		children: [
			{
				...others,
				guid,
				pGuid: groupGuid,
				propStyle: {
					...propStyle,
					top: 0,
					left: 0,
				},
			},
		],
	}

	// 组合插入位置  为第一个子组件位置
	const insertIndex = findComponentIndex(guid)
	// 删除单独的组件
	VisualScreenStore.deleteComponent(guid)

	// 添加分组
	VisualScreenStore.addNewComponent({
		data: groupComponent,
		index: insertIndex,
		tagetList: pGuid ? findComponent(pGuid)?.children : undefined,
	})
}
/**
 * 组合拆分
 */
export const deComposeComponent = () => {
	const { guid, pGuid, children } = VisualScreenStore.activeComponent

	const formatComponents =
		children?.map((item: ScreenComponent) => {
			return {
				...item,
				pGuid: pGuid,
				propStyle: {
					...item.propStyle,
					...getComponentToGroupPostion(item, pGuid),
				},
			}
		}) || []

	const insertIndex = findComponentIndex(guid)
	// 先删除组合
	VisualScreenStore.deleteComponent(guid)

	// 逐个添加组合内的组件  拆散后子组件插入位置组合的位置
	VisualScreenStore.batchAddNewComponent({
		data: formatComponents,
		tagetList: pGuid ? findComponent(pGuid)?.children : undefined,
		index: insertIndex,
	})
}
