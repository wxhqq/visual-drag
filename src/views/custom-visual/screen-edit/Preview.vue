<template>
	<div
		class="visual-preview-page dark hide-scroll-bar"
		v-on-resize="resizePageSize">
		<div
			class="visual-preview-container dark-scroll-bar"
			:style="wrapStyle">
			<component :is="'Vcanvas'"></component>
			<template v-for="(item, index) in allAddedComponents">
				<div
					class="shpae-wrap"
					:key="item.guid"
					:style="getShapeStyle(item, index)">
					<component
						:is="item.component"
						:node-info="item"></component>
				</div>
			</template>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, ProvideReactive, Vue } from 'vue-property-decorator'
import VisualScreenStore, {
	ScreenComponent,
} from '@store/modules/visual-screen'
import { VisualComponentList } from './scripts/auto-register-component'
import { shapeStyleKeys } from './scripts/constants'
import testData from './test-data'

// 组件

@Component({
	components: {
		...VisualComponentList,
	},
})
export default class OcVisualPreview extends Vue {
	// 容器样式
	wrapStyle: {
		transform?: string
		'transform-origin'?: string
		'margin-bottom'?: string | number
	} = {}
	// 画布中所有添加的组件
	get allAddedComponents() {
		return VisualScreenStore.allAddedComponents
	}

	@ProvideReactive() isPreview = true

	created() {
		VisualScreenStore.updateData({
			key: 'allAddedComponents',
			data: testData,
		})
	}
	// 获取形状样式
	getShapeStyle(nodeInfos: ScreenComponent, index: number) {
		const { isShow, propStyle } = nodeInfos
		const res = {
			zIndex: index + 5,
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

	// 计算页面尺寸
	resizePageSize() {
		// 大屏默认大小为1920 1080
		// 屏幕大小 最小1200
		const [defaultW, defaultH] = [1920, 1080]
		const pageInnerW = window.innerWidth > 1200 ? window.innerWidth : 1200
		// 缩放比例
		const scale = pageInnerW / defaultW

		this.wrapStyle = {
			transform: `scale(${scale})`,
			'transform-origin': 'left top',
			'margin-bottom': scale < 1 ? `${defaultH * scale - defaultH}px` : 0,
		}
	}
}
</script>

<style lang="scss" scoped>
.visual-preview-page {
	position: relative;
	width: 100vw;
	height: 100vh;
	min-width: 1200px;
	overflow: auto;
	@include set-theme {
		background-color: get-themed-variable(
			'visual-page-bg'
		); // 防止过渡动画出现时透出白色
	}
}
.visual-preview-container {
	position: absolute;
	@include size(1920px, 1080px);
	overflow: hidden;
}

.shpae-wrap {
	position: absolute;
}
</style>
