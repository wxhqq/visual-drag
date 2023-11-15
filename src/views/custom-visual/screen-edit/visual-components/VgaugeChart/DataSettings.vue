<template>
	<div>
		<ComMetric
			v-bind="$attrs"
			title="指针角度/度量"
			category="measure"
			:limit="1" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import ComMetric from '../../data-panel/ComMetric.vue'
// 数据联动 组件

@Component({
	components: { ComMetric },
})
export default class VbarChartDataSettings extends Vue {}
</script>

<style></style>
