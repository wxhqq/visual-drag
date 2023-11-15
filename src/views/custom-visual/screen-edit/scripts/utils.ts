import VisualScreenStore, {
	ScreenComponent,
} from '@/store/modules/visual-screen'

/**
 * 根据画布比例格式化数据
 * @param data 位置 大小信息
 * @returns
 */
export const formatScaleData = (data: {}): any => {
	const scale = VisualScreenStore.canvasScale
	for (const key in data) {
		data[key] = Math.round(data[key] / scale)
	}
	return data
}

/**
 * 生成组件guid
 * @returns
 */
export const generateGuid = () => {
	const now = new Date().getTime()
	const str = `xxxxxxxx-xxxx-${now}-yxxx`
	return str.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0
		const v = c == 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}
/**
 * 递归变量组件树
 * @returns
 */
export const traverseComponent = (
	components: ScreenComponent[],
	callback: (item: ScreenComponent, pGuid?: string) => void,
	pGuid?: string
) => {
	if (!components.length) return
	components.forEach(item => {
		callback(item, pGuid)
		if (item.children) {
			traverseComponent(item.children, callback, item.guid)
		}
	})
}
/**
 * 查找组件
 * @param guid 要查找的组件的guid
 * @param componentList 查找列表
 * @returns
 */
export const findComponent = (
	guid: string,
	componentList = VisualScreenStore.allAddedComponents
) => {
	let component: ScreenComponent | undefined

	const query = (list: ScreenComponent[]) => {
		if (!list.length) return
		list.find(item => {
			if (item.guid === guid) {
				component = item
			} else if (item.children) {
				query(item.children)
			}
			return item.guid === guid
		})
	}

	query(componentList)
	return component
}
/**
 * 查找组件在当前列表下的索引
 * @param guid 要查找的组件的guid
 * @param componentList 查找列表
 * @returns
 */
export const findComponentIndex = (
	guid: string,
	componentList = VisualScreenStore.allAddedComponents
) => {
	let index = -1

	const query = (list: ScreenComponent[]) => {
		if (!list.length) return
		list.findIndex((item, i) => {
			if (item.guid === guid) {
				index = i
			}
			if (index < 0 && item.children) {
				query(item.children)
			}
			return index > -1
		})
	}
	query(componentList)
	return index
}
/**
 * 根据偏移量计算样式
 * @param style
 * @param offset
 * @returns
 */
export const calculateObjSum = (style: {}, offset: {}) => {
	const res = {}
	Object.keys(offset).forEach(key => {
		res[key] = (style[key] || 0) + offset[key]
		if (key === 'width' || key === 'height') {
			res[key] = Math.max(20, res[key])
		}
	})
	return res
}
/**
 * 获取当前元素相对于画布的位置
 * @param node 当前组件
 * @returns
 */
export const getComponentCanvasPos = (component?: ScreenComponent) => {
	if (!component) {
		return {
			left: 0,
			top: 0,
		}
	}
	const { pGuid: curPGuid, propStyle } = component

	const res = {
		left: propStyle.left,
		top: propStyle.top,
	}

	const query = (pGuid: string) => {
		const node = findComponent(pGuid)
		if (node) {
			res.left += node.propStyle.left
			res.top += node.propStyle.top
			node.pGuid && query(node.pGuid)
		}
	}

	query(curPGuid)

	return res
}

/**
 * 格式化所有节点的层级
 * 1、 1-2、 1-1-1、 1-2-3
 */
export const formatAllAddedComponentsLevel = (
	componentList = VisualScreenStore.allAddedComponents
) => {
	const traverseTree = (list: ScreenComponent[], level: string) => {
		if (!list.length) return
		list.forEach((item, i) => {
			item.level = level ? `${level}-${i + 1}` : `${i + 1}`
			if (item.children) {
				traverseTree(item.children, item.level)
			}
		})
	}
	traverseTree(componentList, '')
}
/**
 * 获取当前元素存在几代子孙
 * @param component
 */
export const getComponentChildrenLayers = (
	node: ScreenComponent = VisualScreenStore.activeComponent
) => {
	const { children } = node
	let layer = 0
	const query = (list: ScreenComponent[]) => {
		if (!list.length) return
		layer++
		list.forEach(item => {
			if (item.children) {
				query(item.children)
			}
		})
	}
	children && query(children)
	return layer
}

/**
 * 查找组件的pguid
 * @param guid 当前组件的guid
 * @param componentList 目标列表
 * @returns
 */
export const findComponentPGuid = (
	guid: string,
	componentList: ScreenComponent[]
) => {
	let index = -1
	let pGuid = ''

	const query = (list: ScreenComponent[], parent?: ScreenComponent) => {
		if (!list.length) return
		list.findIndex((item, i) => {
			if (item.guid === guid) {
				index = i
			}
			if (index < 0 && item.children) {
				query(item.children, item)
			}
			if (index > -1 && !pGuid) {
				pGuid = parent?.guid || ''
			}
			return index > -1
		})
	}

	query(componentList)
	return pGuid
}
