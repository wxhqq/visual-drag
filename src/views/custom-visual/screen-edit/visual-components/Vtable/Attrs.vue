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

// 组件属性

@Component
export default class VtableAttr extends Vue {
	@Prop() attrStyle: {}

	get formItems() {
		return [
			{
				key: 'tableTheme',
				label: '表格主题',
				bltype: 'radio',
				type: 'button',
				options: [
					{ label: '简单', value: 'simple' },
					{ label: '斑马纹', value: 'stripe' },
					{ label: '线框', value: 'border' },
				],
			},
		]
	}
}
</script>

<style></style>
