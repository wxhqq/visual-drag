import VisualScreenRollback from '@store/modules/visual-screen-rollback'
import { debounce } from '@/scripts/utils'
import VisualScreenStore, {
	ScreenComponent,
} from '@/store/modules/visual-screen'
import {
	calculateObjSum,
	findComponent,
	findComponentPGuid,
	getComponentCanvasPos,
	traverseComponent,
} from './utils'

/**
 * 初始化画布大小和位置
 * @param centerEle 画布的父容器
 */
export const initCanvasSize = () => {
	const centerEle = document.querySelector('.center-container')
	if (centerEle) {
		const canvasMargin = 24
		const scale = +(
			(centerEle['offsetWidth'] - canvasMargin * 2) /
			1920
		).toFixed(3)

		VisualScreenStore.updateData({
			key: 'canvasScale',
			data: scale,
		})
		centerEle.scrollTop = 1080 + 640 - (1080 * scale) / 2 - canvasMargin
		centerEle.scrollLeft = 1920 + 640 - (1920 * scale) / 2 - canvasMargin
	}
}
/**
 * 组件添加时 计算节点 放置的位置 判断拖拽边界
 * @param container 画布容器
 * @param originalEvent 拖拽事件
 * @returns
 */
export const computedNodePos = (
	container: HTMLElement,
	originalEvent: { pageX: number; pageY: number }
) => {
	const { left, top, right, bottom } = container.getBoundingClientRect()
	const { pageX, pageY } = originalEvent

	const scale = VisualScreenStore.canvasScale

	// 判断是否拖拽到画布容器中，要使用 pageX 参数，以浏览器左上角为基准，计算出相对于绘图区的位置
	if (pageX < left || pageY < top) {
		return
	}
	// todo 限制右侧及下方边界，要加上组件宽高
	if (pageX > right || pageY > bottom) {
		return
	}

	// 根据缩放比例计算实际位置，向上取整
	return {
		left: Math.ceil((pageX - left) / scale),
		top: Math.ceil((pageY - top) / scale),
	}
}

/**
 * 缩放组件：计算组件的样式偏移值，计算组件的大小  宽高最小20
 * @param pointName 缩放的点位名称
 * @param offset 鼠标偏移值
 * @returns 计算后样式偏移的值
 */
export const calculateComponentStyleOffset = (
	pointName: string,
	offset: { left: number; top: number }
) => {
	const offsetStyle = { left: 0, top: 0, width: 0, height: 0 }
	if (pointName.includes('top')) {
		offsetStyle.top = offset.top
		offsetStyle.height = -offset.top
	} else if (pointName.includes('bottom')) {
		offsetStyle.height = offset.top
	}

	if (pointName.includes('left')) {
		offsetStyle.left = offset.left
		offsetStyle.width = -offset.left
	} else if (pointName.includes('right')) {
		offsetStyle.width = offset.left
	}
	return offsetStyle
}
/**
 * 刷新组件位置
 * @param newPos 目标位置
 */
export const refreshComponentStyle = (offset: {
	left?: number
	top?: number
	width?: number
	height?: number
}) => {
	const { propStyle } = VisualScreenStore.activeComponent

	const { isShow, areaStyle, areaComponents } =
		VisualScreenStore.selectedDatas
	if (isShow && areaComponents.length) {
		// 如果存在框选区域， 且框选区的内的组件
		if (offset.width || offset.height) {
			traverseComponent(areaComponents, item => {
				if (
					item.component !== 'Vgroup' &&
					!item.isLock &&
					item.isShow
				) {
					Object.assign(
						item.propStyle,
						calculateObjSum(item.propStyle, offset)
					)
				}
			})
		} else {
			areaComponents.forEach(item => {
				if (!item.isLock && item.isShow) {
					Object.assign(
						item.propStyle,
						calculateObjSum(item.propStyle, offset)
					)
				}
			})
		}
		Object.assign(areaStyle, calculateObjSum(areaStyle, offset))
	} else {
		VisualScreenStore.setActiveShapeStyle(
			calculateObjSum(propStyle, offset)
		)
	}
	debounceChange(VisualScreenRollback.pushRecord)
}
//  事件防抖
const debounceChange = debounce((callback: () => void) => {
	callback()
}, 1000)
/**
 * 刷新组合的样式 当组合内的子组件位置或大小发生改变时
 * @param groupComponent 当前组合组件
 */
export const refreshGroupStyle = (groupComponent: ScreenComponent) => {
	// 组合体左上边界偏移量 会影响所有子组件的top和left
	let offsetLeft = Infinity
	let offsetTop = Infinity

	// 组合体的右下边界
	let bottom = -Infinity
	let right = -Infinity

	const { propStyle: parentStyle } = groupComponent
	groupComponent?.children?.forEach((sub: ScreenComponent) => {
		const { propStyle } = sub
		offsetLeft = Math.min(propStyle.left, offsetLeft)
		offsetTop = Math.min(propStyle.top, offsetTop)

		bottom = Math.max(
			propStyle.top + propStyle.height + parentStyle.top,
			bottom
		)
		right = Math.max(
			propStyle.left + propStyle.width + parentStyle.left,
			right
		)
	})
	if (groupComponent.children) {
		if (offsetLeft !== 0 || offsetTop !== 0) {
			groupComponent.children.forEach((sub: ScreenComponent) => {
				const { propStyle } = sub
				Object.assign(sub.propStyle, {
					...propStyle,
					top: propStyle.top - offsetTop,
					left: propStyle.left - offsetLeft,
				})
			})
		}
		Object.assign(groupComponent.propStyle, {
			top: parentStyle.top + offsetTop,
			left: parentStyle.left + offsetLeft,
			width: Math.ceil(right - (parentStyle.left + offsetLeft)),
			height: Math.ceil(bottom - (parentStyle.top + offsetTop)),
		})
	}
}

/**
 * 获取组件移动到目标组合后 相对于组合的位置
 * @param curNode 操作组件
 * @param targetGroup 目标组合
 * @returns
 */
export const getComponentToGroupPostion = (
	curNode: ScreenComponent,
	pGuid: string
) => {
	const realPos = getComponentCanvasPos(curNode)

	const targetGroup = findComponent(pGuid)

	const realTarGroupPos = getComponentCanvasPos(targetGroup)

	return {
		left: realPos.left - realTarGroupPos.left,
		top: realPos.top - realTarGroupPos.top,
	}
}
/**
 * 组件目录拖拽时多种条件组件计算
 * @param curretComponent 当前拖拽组件
 * @param allSortComponents 排序后的所有组件列表
 * @param curComponentCanvasPos 当前组件相对于画布的位置
 */
export const afterEndDragComponentList = (
	curretComponent: ScreenComponent,
	allSortComponents: ScreenComponent[],
	curComponentCanvasPos: { top: number; left: number }
) => {
	// 当前组件
	const { pGuid: curPGuid, guid } = curretComponent
	const tarPGuid = findComponentPGuid(guid, allSortComponents)

	const targetGroup = findComponent(tarPGuid, allSortComponents)

	traverseComponent(allSortComponents, item => {
		if (item.guid === guid) {
			if (tarPGuid && targetGroup && tarPGuid !== curPGuid) {
				const tarGroupPos = getComponentCanvasPos(targetGroup)
				Object.assign(item.propStyle, {
					top: curComponentCanvasPos.top - tarGroupPos.top,
					left: curComponentCanvasPos.left - tarGroupPos.left,
				})
			} else if (!tarPGuid) {
				Object.assign(item.propStyle, curComponentCanvasPos)
			}
			//当前元素
			item.pGuid = tarPGuid || ''
		}
	})
	VisualScreenStore.updateData({
		key: 'allAddedComponents',
		data: allSortComponents,
	})
}
/**
 * 获取框选区的组件列表
 * @param selectAreaStyle 框选区域样式
 * @returns groupComponents 框选区中的组件
 */
export const getComponentInSelectedArea = () => {
	// 框选区域样式
	const { top, left, width, height } =
		VisualScreenStore.selectedDatas.areaStyle
	const [right, bottom] = [left + width, top + height]
	// 框选区域内的组件
	const groupComponents: ScreenComponent[] = []

	// 组合体的边界
	const groupStyle = {
		top: Infinity,
		left: Infinity,
		bottom: -Infinity,
		right: -Infinity,
	}
	// 遍历判断在框选区域内的组件
	const allAddedComponents = VisualScreenStore.allAddedComponents
	allAddedComponents.forEach(item => {
		const { propStyle } = item
		// 左上边界
		const insideLeftTopBorder =
			top < propStyle.top + propStyle.height &&
			left < propStyle.left + propStyle.width

		// 右下边界
		const insideRightBottomBorder =
			right > propStyle.left && bottom > propStyle.top

		if (insideLeftTopBorder && insideRightBottomBorder) {
			groupComponents.push(item)
			groupStyle.top = Math.min(propStyle.top, groupStyle.top)
			groupStyle.left = Math.min(propStyle.left, groupStyle.left)

			groupStyle.bottom = Math.max(
				propStyle.top + propStyle.height,
				groupStyle.bottom
			)
			groupStyle.right = Math.max(
				propStyle.left + propStyle.width,
				groupStyle.right
			)
		}
	})

	if (groupComponents.length >= 1) {
		VisualScreenStore.updateSelectDates({
			areaStyle: {
				top: groupStyle.top,
				left: groupStyle.left,
				width: Math.ceil(groupStyle.right - groupStyle.left),
				height: Math.ceil(groupStyle.bottom - groupStyle.top),
			},
		})
	}
	return groupComponents
}

/**
 * 根据选中的组件 计算框选区的样式
 * @param areaComponents 选中的组件
 */
export const calcSelectAreaStyle = (areaComponents: ScreenComponent[]) => {
	// 组合体的边界
	const groupStyle = {
		top: Infinity,
		left: Infinity,
		bottom: -Infinity,
		right: -Infinity,
	}
	areaComponents.forEach(item => {
		// 相对于画布的距离
		const itemCanvasPos = getComponentCanvasPos(item)
		const { width, height } = item.propStyle
		groupStyle.top = Math.min(itemCanvasPos.top, groupStyle.top)
		groupStyle.left = Math.min(itemCanvasPos.left, groupStyle.left)

		groupStyle.bottom = Math.max(
			itemCanvasPos.top + height,
			groupStyle.bottom
		)
		groupStyle.right = Math.max(
			itemCanvasPos.left + width,
			groupStyle.right
		)
	})
	return {
		top: groupStyle.top,
		left: groupStyle.left,
		width: Math.ceil(groupStyle.right - groupStyle.left),
		height: Math.ceil(groupStyle.bottom - groupStyle.top),
	}
}
