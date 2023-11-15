<template>
	<section
		class="editor-container"
		id="visiualEditorContainer"
		@mousedown="onSelectArea">
		<component :is="'Vcanvas'"></component>
		<template v-for="(item, index) in allAddedComponents">
			<Shape :key="item.guid" :index="index" :nodeInfos="item">
				<component :is="item.component" :node-info="item"></component>
			</Shape>
		</template>

		<!-- 拖拽吸附参考线 -->
		<DragMarkLine />

		<!-- 选中区域 -->
		<SelectingArea
			:propStyle="selectAreaInfos.areaStyle"
			v-show="selectAreaInfos.isShow" />
	</section>
</template>

<script lang="ts">
import { Component, ProvideReactive, Vue } from 'vue-property-decorator'

import VisualScreenStore from '@store/modules/visual-screen'
import { formatAllAddedComponentsLevel, formatScaleData } from './scripts/utils'
// 组件
import Shape from './components/Shape.vue'
import DragMarkLine from './components/DragMarkLine.vue'
import SelectingArea from './components/SelectingArea.vue'

import { VisualComponentList } from './scripts/auto-register-component'
import { getComponentInSelectedArea } from './scripts/calculate-util'

// 编辑栏
@Component({
	components: {
		Shape,
		DragMarkLine,
		SelectingArea,
		...VisualComponentList,
	},
})
export default class VisualEditor extends Vue {
	canvasContainer: HTMLElement

	//选中信息
	get selectAreaInfos() {
		return VisualScreenStore.selectedDatas
	}

	get activeComponent() {
		return VisualScreenStore.activeComponent
	}
	// 画布中所有添加的组件
	get allAddedComponents() {
		// 如果所有数据更新，则更新层级
		formatAllAddedComponentsLevel()
		return VisualScreenStore.allAddedComponents
	}

	// 画布的缩放比例
	get scale() {
		return VisualScreenStore.canvasScale
	}

	@ProvideReactive() isPreview = false

	mounted() {
		const mainContainer = document.getElementById('visiualEditorContainer')
		if (mainContainer) {
			this.canvasContainer = mainContainer
		}
	}

	beforeDestroy() {}

	/**
	 * 框选区域
	 */
	onSelectArea(e: MouseEvent) {
		// 隐藏菜单
		VisualScreenStore.updateData({
			key: 'contextInfo',
			data: { isShow: false, top: '0', left: '0' },
		})
		// 按住空格则不允许选择  拖拽画布操作
		if (VisualScreenStore.holdSpace) return
		e.stopPropagation()

		this.hideArea()

		// 获取编辑器的位移信息，每次点击时都需要获取一次。主要是为了方便开发时调试用。
		const { top, left } = this.canvasContainer.getBoundingClientRect()
		const rectInfoByScale = formatScaleData({
			top,
			left,
		})
		const startPoint = formatScaleData({
			x: e.pageX,
			y: e.pageY,
		})

		// 展示选中区域
		VisualScreenStore.updateSelectDates({ isShow: true })

		const move = (moveEvent: MouseEvent) => {
			const { clientX, clientY } = formatScaleData({
				clientX: moveEvent.clientX,
				clientY: moveEvent.clientY,
			})
			// 框选区样式更新
			VisualScreenStore.updateSelectDates({
				areaStyle: {
					width: Math.round(Math.abs(clientX - startPoint.x)),
					height: Math.round(Math.abs(clientY - startPoint.y)),
					top: Math.round(
						Math.min(
							startPoint.y - rectInfoByScale.top,
							clientY - rectInfoByScale.top
						)
					),
					left: Math.round(
						Math.min(
							startPoint.x - rectInfoByScale.left,
							clientX - rectInfoByScale.left
						)
					),
				},
			})
		}

		const up = (moveEvent: MouseEvent) => {
			document.removeEventListener('mousemove', move)
			document.removeEventListener('mouseup', up)

			VisualScreenStore.resetActiveComponent()

			const { clientX, clientY } = formatScaleData({
				clientX: moveEvent.clientX,
				clientY: moveEvent.clientY,
			})
			if (clientX == startPoint.x && clientY == startPoint.y) {
				this.hideArea()
				return
			}

			// 获取组数据  重新计算框选区style
			const groupComponents = getComponentInSelectedArea()

			if (groupComponents.length < 1) {
				this.hideArea()
				return
			}
			VisualScreenStore.updateSelectDates({
				areaComponents: groupComponents,
			})
		}

		document.addEventListener('mousemove', move)
		document.addEventListener('mouseup', up)
	}
	// 隐藏框选区域
	hideArea() {
		VisualScreenStore.hideSelectArea()
	}
}
</script>

<style lang="scss" scoped>
.editor-container {
	position: relative;
	@include size(1920px, 1080px);
	background: $color-grey-92;
	background-image: linear-gradient(white 0px, transparent 0),
		linear-gradient(90deg, white 0px, transparent 0),
		linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 0),
		linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 0);
	background-size: 20px 20px;
}

// 拖拽样式
.sortable-fallback {
	cursor: move;
	opacity: 1 !important;
}
.ghost-class {
	opacity: 0;
}
.hiden-drag-node {
	opacity: 0 !important;
}
</style>
