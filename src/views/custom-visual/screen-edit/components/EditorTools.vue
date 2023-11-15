<template>
	<div class="editor-tool-wrap">
		<i class="bl-icon-decrease" @click="zoomOut"></i>
		<Input
			v-model="scale"
			type="number"
			class="zoom-num"
			@on-change="onScaleChange" />
		<span class="percent">%</span>
		<i class="bl-icon-increase" @click="zoomIn"></i>
		<i
			class="ivu-icon ivu-icon-md-qr-scanner ml-8px"
			@click="fixToEditor"></i>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { debounce } from '@utils'

// 画布操作按钮  最小30%  最大200%
import VisualScreenStore from '@store/modules/visual-screen'
import { initCanvasSize } from '../scripts/calculate-util'

@Component
export default class EditorTools extends Vue {
	scale = 100
	// 画布的缩放比例
	get canvasScale() {
		return Math.round(VisualScreenStore.canvasScale * 100)
	}

	@Watch('canvasScale')
	onChange() {
		this.scale = this.canvasScale
	}

	//画布比例大小
	onScaleChange() {
		this.debounceChange(() => {
			if (!this.scale) {
				this.scale = this.canvasScale
			}
			if (this.scale < 30) {
				this.scale = 20
			} else if (this.scale > 200) {
				this.scale = 200
			}
			VisualScreenStore.updateData({
				key: 'canvasScale',
				data: this.scale / 100,
			})
		})
	}
	//  事件防抖
	debounceChange = debounce((callback: () => void) => {
		callback()
	}, 1000)

	// 放大
	zoomIn() {
		VisualScreenStore.updateData({
			key: 'canvasScale',
			data: Math.min(VisualScreenStore.canvasScale + 0.1, 2),
		})
	}
	// 缩小
	zoomOut() {
		VisualScreenStore.updateData({
			key: 'canvasScale',
			data: Math.max(VisualScreenStore.canvasScale - 0.1, 0.3),
		})
	}
	// 适应屏幕
	fixToEditor() {
		initCanvasSize()
	}
}
</script>

<style lang="scss" scoped>
.editor-tool-wrap {
	position: relative;
	display: flex;
	align-items: center;
	height: 32px;
	.zoom-num {
		width: 60px;
		margin: 0 8px;
	}
	.percent {
		position: absolute;
		background: $color-grey-92;
		right: 86px;
		height: 20px;
		z-index: 10;
	}
	i {
		display: inline-block;
		@include size(32px);
		line-height: 32px;
		text-align: center;
		cursor: pointer;
		font-size: 20px;
		border: 1px solid $color-grey-75;
	}
}
</style>
