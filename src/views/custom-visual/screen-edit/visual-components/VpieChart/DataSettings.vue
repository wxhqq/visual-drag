<template>
	<div>
		<ComMetric
			v-bind="$attrs"
			title="扇区标签/维度"
			category="dimension"
			:limit="1" />
		<ComMetric
			v-bind="$attrs"
			title="扇区角度/度量"
			category="measure"
			:limit="10" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import ComMetric from '../../data-panel/ComMetric.vue'
// 数据联动 组件

@Component({
	components: { ComMetric },
})
export default class VpieChartDataSettings extends Vue {}
</script>

<style></style>
