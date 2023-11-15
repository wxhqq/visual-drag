<template>
	<div
		class="shpae-wrap"
		@mousedown="onComponentDragginging"
		:style="getShapeStyle"
		:class="shapeClass">
		<template v-if="nodeInfos.component !== 'Vgroup'">
			<span
				v-show="!nodeInfos.isLock"
				v-for="(direction, key) in pointList"
				:key="key"
				class="shape-point"
				:style="getPointStyle(key)"
				@mousedown="onComponentResizing(key, $event)"></span>
		</template>
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { findComponent, formatScaleData } from '../scripts/utils'
import { Component, Prop, Vue } from 'vue-property-decorator'

import { shapeStyleKeys } from '../scripts/constants'

import VisualScreenStore, {
	ScreenComponent,
} from '@store/modules/visual-screen'

import {
	calculateComponentStyleOffset,
	refreshComponentStyle,
} from '../scripts/calculate-util'

// 缩放锚点组件

@Component
export default class Shape extends Vue {
	@Prop() index: number //当前组件索引
	// 组件信息
	@Prop() nodeInfos: ScreenComponent
	get activeComponent() {
		return VisualScreenStore.activeComponent
	}

	// 框选区的所有组件
	get allComponentGuidInArea() {
		return VisualScreenStore.selectedDatas.areaComponents.map(
			item => item.guid
		)
	}
	// class类名
	get shapeClass() {
		const { guid, pGuid } = this.activeComponent
		return {
			actived: guid == this.nodeInfos.guid, //选中某个组件时active
			'active-border':
				pGuid === this.nodeInfos.guid || //选中子组件时  父组件active
				this.allComponentGuidInArea.includes(this.nodeInfos.guid), //组件在框选区域内active
		}
	}

	// 缩放锚点
	pointList = {
		'left-top': 'nwse-resize',
		top: 'ns-resize',
		'right-top': 'nesw-resize',
		right: 'ew-resize',
		'right-bottom': 'nwse-resize',
		bottom: 'ns-resize',
		'left-bottom': 'nesw-resize',
		left: 'ew-resize',
	}

	// 画布的缩放比例
	get scale() {
		return VisualScreenStore.canvasScale
	}
	// 获取形状样式
	get getShapeStyle() {
		const { guid, pGuid, isShow, propStyle } = this.nodeInfos
		const list =
			findComponent(pGuid)?.children ||
			VisualScreenStore.allAddedComponents
		const res = {
			zIndex:
				guid === this.activeComponent.guid
					? list.length + 5
					: this.index + 5,
			display: isShow ? 'block' : 'none',
		}
		Object.keys(propStyle).forEach(key => {
			if (shapeStyleKeys.includes(key)) {
				res[key] =
					typeof propStyle[key] === 'number'
						? `${propStyle[key]}px`
						: propStyle[key]
			}
		})
		return res
	}

	// 获取样式
	getPointStyle(point: string) {
		const hasTop = /top/.test(point)
		const hasLeft = /left/.test(point)
		const hasRight = /right/.test(point)
		const hasBottom = /bottom/.test(point)
		const res = {}

		hasTop && (res['top'] = '-4px')
		hasLeft && (res['left'] = '-4px')
		hasRight && (res['right'] = '-4px')
		hasBottom && (res['bottom'] = '-4px')

		if (point === 'left' || point === 'right') {
			res['top'] = 'calc(50% - 4px)'
		} else if (point === 'top' || point === 'bottom') {
			res['left'] = 'calc(50% - 4px)'
		}
		return {
			...res,
			cursor: this.pointList[point],
		}
	}
	/**
	 * 组件拖拽 移动位置
	 * 没有框选区域时移动单个组件，有框选区域移动框选区域内所有的组件
	 */
	onComponentDragginging(e: MouseEvent) {
		if (VisualScreenStore.holdSpace) return

		if (!this.allComponentGuidInArea.includes(this.nodeInfos.guid)) {
			VisualScreenStore.hideSelectArea()
		}

		// 阻止冒泡
		e.stopPropagation()

		// 激活选中当前组件
		VisualScreenStore.updateData({
			key: 'activeComponent',
			data: this.nodeInfos,
		})

		if (this.nodeInfos.isLock) return

		// 标记为正在拖拽状态
		VisualScreenStore.updateData({
			key: 'isComponentDragging',
			data: true,
		})

		// 起点
		let startPoint = formatScaleData({
			x: e.screenX,
			y: e.screenY,
		})

		const move = (moveEvent: MouseEvent) => {
			// 终点
			const endPoint = formatScaleData({
				x: moveEvent.screenX,
				y: moveEvent.screenY,
			})

			refreshComponentStyle({
				top: Math.round(endPoint.y - startPoint.y),
				left: Math.round(endPoint.x - startPoint.x),
			})

			// 更新起点
			startPoint = { ...endPoint }

			this.$EventBus.$emit('component-move')
		}

		const up = () => {
			document.removeEventListener('mousemove', move)
			document.removeEventListener('mouseup', up)
			VisualScreenStore.updateData({
				key: 'isComponentDragging',
				data: false,
			})
		}

		document.addEventListener('mousemove', move)
		document.addEventListener('mouseup', up)
	}

	// 组件缩放
	onComponentResizing(pointName: string, e: MouseEvent) {
		if (VisualScreenStore.holdSpace) return

		e.stopPropagation()
		e.preventDefault()

		let isFirst = true
		// 起点
		let startPoint = formatScaleData({
			x: e.screenX,
			y: e.screenY,
		})
		const move = (moveEvent: MouseEvent) => {
			moveEvent.stopPropagation()
			moveEvent.preventDefault()

			// 第一次点击时也会触发 move，所以会有“刚点击组件但未移动，组件的大小却改变了”的情况发生
			// 因此第一次点击时不触发 move 事件
			if (isFirst) {
				isFirst = false
				return
			}
			// 终点
			const endPoint = formatScaleData({
				x: moveEvent.screenX,
				y: moveEvent.screenY,
			})
			const offsetStyle = calculateComponentStyleOffset(pointName, {
				top: Math.round(endPoint.y - startPoint.y),
				left: Math.round(endPoint.x - startPoint.x),
			})

			refreshComponentStyle(offsetStyle)

			// 更新起点
			startPoint = { ...endPoint }
		}

		const up = () => {
			document.removeEventListener('mousemove', move)
			document.removeEventListener('mouseup', up)
		}

		document.addEventListener('mousemove', move)
		document.addEventListener('mouseup', up)
	}
}
</script>

<style lang="scss" scoped>
.shpae-wrap {
	position: absolute;
	border: 1px solid transparent;
	min-width: 20px;
	min-height: 20px;
	&:hover {
		cursor: move;
	}
}
.actived {
	@include set-theme {
		border: 1px solid get-themed-variable('color-theme-primary');
	}
}
.active-border {
	@include set-theme {
		border: 1px solid rgba(get-themed-variable('color-theme-primary'), 0.5);
	}
}
.active-border > .shape-point {
	display: none;
}
.actived > .shape-point {
	display: inline-block;
}
::v-deep.actived > .group > .group-marker {
	display: block;
}
::v-deep.active-border > .group > .group-marker {
	display: block;
}

.shape-point {
	position: absolute;
	display: none;
	@include set-theme {
		border: 1px solid get-themed-variable('color-theme-primary');
	}
	background: $color-grey-92;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	z-index: 2;
}
</style>
