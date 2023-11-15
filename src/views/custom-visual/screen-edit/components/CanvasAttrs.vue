<template>
	<div class="canvas-attrs">
		<div class="title font-bold">页面设置</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/**
 * 画布属性， 包括自定义头部 尾部 背景色等
 */

@Component
export default class CanvasAttrs extends Vue {}
</script>

<style lang="scss" scoped>
.canvas-attrs {
	padding: 16px;
	.title {
		color: $color-white-100;
	}
}
</style>
