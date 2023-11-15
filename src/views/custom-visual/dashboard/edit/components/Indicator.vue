<template>
	<div class="bi-layout-indicator" :style="cardWrapStyle">
		<div
			v-for="(item, index) in Array(12)"
			:key="index"
			:style="colWrapStyle"></div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VisualDashboardStore from '@store/modules/visual-dashboard'

// 指示器组件

@Component
export default class OcBiIndicator extends Vue {
	// 栅格容器样式
	get cardWrapStyle() {
		const { cardGap } = VisualDashboardStore.themeOptions
		return {
			gap: `${cardGap}px`,
			'grid-template-columns': `repeat(12, calc((100% - ${cardGap} * 11px) / 12))`,
		}
	}

	get colWrapStyle() {
		const { cardGap } = VisualDashboardStore.themeOptions
		return {
			'background-image': `linear-gradient(
						0deg,
						rgba(46, 116, 255, 0.12) 30px,
						transparent ${cardGap}px
					)`,
			'background-size': `100% ${30 + cardGap}px`,
		}
	}
}
</script>

<style lang="scss" scoped>
.bi-layout-indicator {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	top: 8px;
	display: none;
	grid-template-columns: repeat(12, calc((100% - 88px) / 12));
	grid-auto-flow: column;
	gap: 8px;
	pointer-events: none;
	z-index: 200;
	& > * {
		background-image: linear-gradient(
			0deg,
			rgba(46, 116, 255, 0.05) 30px,
			transparent 20px
		);
		background-size: 100% 50px;
	}
}
</style>
