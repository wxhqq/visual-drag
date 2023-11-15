<template>
	<Tabs value="attrs">
		<TabPane label="画布属性" name="attrs"></TabPane>
	</Tabs>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/**
 * 画布属性， 包括自定义头部 尾部 背景色等
 */

@Component
export default class VcanvasAttrs extends Vue {}
</script>

<style lang="scss" scoped>
::v-deep .ivu-tabs-nav-scroll {
	@include flex-justify(center);
}
</style>
