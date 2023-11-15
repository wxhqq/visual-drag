<template>
	<ComMetric v-bind="$attrs" title="数据列/维度或度量" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import ComMetric from '../../data-panel/ComMetric.vue'
// 数据联动 组件

@Component({
	components: { ComMetric },
})
export default class VtableDataSettings extends Vue {}
</script>

<style></style>
