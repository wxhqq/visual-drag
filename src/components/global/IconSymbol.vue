<template>
	<svg
		class="bolean-iconfont"
		aria-hidden="true"
		:style="{
			fontSize: `${size}px`,
			width: `${size}px`,
			height: `${size}px`,
		}">
		<use :xlink:href="icon"></use>
	</svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class IconSymbol extends Vue {
	// 图标名称，例如 bl-icon-add
	@Prop() icon: string
	@Prop({ default: 16 }) size: number | string
}
</script>

<style lang="scss">
// 类名需要与字体名称一致，不可修改
.bolean-iconfont {
	width: 16px;
	height: 16px;
	vertical-align: -0.18em;
	fill: currentColor;
	overflow: hidden;
}
</style>
