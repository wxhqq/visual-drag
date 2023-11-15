<template>
	<div class="mark-line">
		<div
			v-for="(status, line) in markLines"
			v-show="status || false"
			:key="line"
			:style="getMarkLineStyle(line)"
			:class="
				line.includes('x-')
					? `${line} xline line`
					: `${line} yline line`
			"></div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

import VisualScreenStore, {
	ScreenComponent,
} from '@store/modules/visual-screen'
import {
	findComponent,
	getComponentCanvasPos,
	traverseComponent,
} from '../scripts/utils'
import { refreshComponentStyle } from '../scripts/calculate-util'

// 拖拽吸附参考下 组件

const DragDiff = 3 // 相距 dff 像素将自动吸附

//展示参考线时 名称对应关系
const showLineNameMap = {
	'x-top': 'x-bottom',
	'x-bottom': 'x-top',
	'y-left': 'y-right',
	'y-right': 'y-left',
}
@Component
export default class DragMarkLine extends Vue {
	markLines = {
		'x-top': false,
		'x-center': false,
		'x-bottom': false,
		'y-left': false,
		'y-center': false,
		'y-right': false,
	}

	get activeComponent() {
		return VisualScreenStore.activeComponent
	}
	// 画布中选中的组件， 是否处于拖拽状态
	get isComponentDragging() {
		return VisualScreenStore.isComponentDragging
	}

	// 父容器中所有参考下的位置
	get allComponentMarkLinePos() {
		const res: {
			'x-top': number
			'x-center': number
			'x-bottom': number
			'y-left': number
			'y-center': number
			'y-right': number
			label: string
			guid: string
		}[] = []

		//排除子组件
		const childrenGuidSet = new Set()
		childrenGuidSet.add(this.activeComponent.guid)
		const allAddedComponents = VisualScreenStore.allAddedComponents
		traverseComponent(allAddedComponents, item => {
			if (!childrenGuidSet.has(item.pGuid)) {
				res.push({
					guid: item.guid,
					label: item.label,
					...this.getLineCanvasPos(item),
				})
			} else {
				childrenGuidSet.add(item.guid)
			}
		})

		// 排除父元素 和自身
		const selfAndParendGuidSet = new Set()
		let pGuid = this.activeComponent.pGuid
		selfAndParendGuidSet.add(this.activeComponent.guid)
		selfAndParendGuidSet.add(pGuid)
		while (pGuid) {
			const parent = findComponent(pGuid)
			parent && selfAndParendGuidSet.add(parent.guid)
			pGuid = parent?.pGuid || ''
		}

		return res.filter(item => !selfAndParendGuidSet.has(item.guid))
	}

	// 当前组件所有参考线的位置
	get activeNodeLinePos() {
		return this.getLineCanvasPos(this.activeComponent)
	}

	@Watch('isComponentDragging')
	onDragStatusChange() {
		!this.isComponentDragging && this.hideLines()
	}

	mounted() {
		// 监听元素移动和不移动的事件
		this.$EventBus.$on('component-move', () => {
			this.showLines()
		})
	}
	destroyed() {
		// 取消对bus事件的监听
		this.$EventBus.$off('component-move')
	}

	// 获取参考下样式
	getMarkLineStyle(lineName: string) {
		const res = {}
		const pos = this.activeNodeLinePos[lineName]
		res[lineName.includes('x-') ? 'top' : 'left'] = `${pos}px`
		return res
	}
	// 获取当前组件的线条位置
	getLineCanvasPos(component: ScreenComponent) {
		// 获取组件相对于画布的位置
		const { top, left } = getComponentCanvasPos(component)
		const { width, height } = component.propStyle
		return {
			'x-top': top,
			'x-center': Math.round(top + height / 2),
			'x-bottom': Math.round(top + height),
			'y-left': left,
			'y-center': Math.round(left + width / 2),
			'y-right': Math.round(left + width),
		}
	}

	// 显示线条
	showLines() {
		this.hideLines()
		// 出现参考线时，相对应的line名称
		const curlineNameMap = {}

		for (const key in this.activeNodeLinePos) {
			this.allComponentMarkLinePos.forEach(item => {
				if (this.markLines[key]) {
					return
				}

				this.markLines[key] =
					Math.abs(this.activeNodeLinePos[key] - item[key]) < DragDiff

				if (this.markLines[key]) {
					// 上和上、下和下、左和左、右和右、中和中
					curlineNameMap[key] = key
				} else if (showLineNameMap[key]) {
					// 相对应的参考线： 上和下、左和右
					const mapLine = showLineNameMap[key]
					this.markLines[key] =
						Math.abs(this.activeNodeLinePos[key] - item[mapLine]) <
						DragDiff

					this.markLines[key] && (curlineNameMap[key] = mapLine)
				}
				// 吸附
				if (this.markLines[key]) {
					const newPos = this.calculateAdsorptionPos(
						key,
						item[curlineNameMap[key]]
					)
					refreshComponentStyle({
						top: newPos.top - this.activeComponent.propStyle.top,
						left: newPos.left - this.activeComponent.propStyle.left,
					})
				}
			})
		}
	}

	// 计算吸附后的位置
	calculateAdsorptionPos(lineName: string, targetPos: number) {
		const { width, height, top, left } = this.activeComponent.propStyle
		const res = {
			top,
			left,
		}
		// 组件的绝对位置
		const comCnavasPos = {
			top: this.activeNodeLinePos['x-top'],
			left: this.activeNodeLinePos['y-left'],
		}

		if (lineName.includes('x-')) {
			let offset = comCnavasPos.top - top
			if (lineName == 'x-center') {
				offset += height / 2
			} else if (lineName == 'x-bottom') {
				offset += height
			}
			res['top'] = targetPos - offset
		} else {
			let offset = comCnavasPos.left - left
			if (lineName == 'y-center') {
				offset += width / 2
			} else if (lineName == 'y-right') {
				offset += width
			}
			res['left'] = targetPos - offset
		}

		return res
	}

	// 隐藏所有参考线
	hideLines() {
		for (const key in this.markLines) {
			this.markLines[key] = false
		}
	}
}
</script>

<style lang="scss" scoped>
.mark-line {
	height: 100%;
}

.line {
	@include set-theme {
		background: get-themed-variable('color-theme-primary');
	}
	position: absolute;
	z-index: 1000;
}

.xline {
	width: 100%;
	height: 1px;
}

.yline {
	width: 1px;
	height: 100%;
}
</style>
