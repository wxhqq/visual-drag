<template>
	<bl-form
		class="attr-form-wrap"
		:formItems="formItems"
		:defaultValue="attrStyle"
		:label-width="70"
		itemSize="small"
		:labelColon="false"
		labelPosition="left"
		itemClass="mb-1"></bl-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class VcontainerAttr extends Vue {
	@Prop() attrStyle: {}

	// 筛选框配置
	get formItems() {
		return [
			{
				key: 'text',
				label: '标题',
			},
			{
				key: 'align',
				label: '对齐方式',
				bltype: 'radio',
				type: 'button',
				options: ['left', 'center', 'right'],
			},
		]
	}
}
</script>

<style></style>
