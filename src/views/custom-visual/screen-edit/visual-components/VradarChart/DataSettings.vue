<template>
	<div>
		<ComMetric
			v-bind="$attrs"
			title="分支标签/维度"
			category="dimension"
			:limit="1" />
		<ComMetric
			v-bind="$attrs"
			title="分支长度/度量"
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
export default class VradarChartDataSettings extends Vue {}
</script>

<style></style>
