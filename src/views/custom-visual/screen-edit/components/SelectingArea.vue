<template>
	<div class="select-area" :style="areaStyle"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

// 选中区域

@Component
export default class SelectingArea extends Vue {
	@Prop() propStyle: {}

	get areaStyle() {
		const res = {}
		Object.keys(this.propStyle).forEach(key => {
			res[key] = `${this.propStyle[key]}px`
		})
		return res
	}
}
</script>

<style lang="scss" scoped>
.select-area {
	position: absolute;
	@include set-theme {
		border: 1px solid get-themed-variable('color-theme-primary');
	}
}
</style>
