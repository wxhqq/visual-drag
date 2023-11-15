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
const fontFamilyOps = [
	{
		label: '微软雅黑',
		value: 'MicrosoftYaHeiUI',
	},
	{
		label: 'YouSheBiaoTiHei',
		value: 'YouSheBiaoTiHei',
	},
	{
		label: 'LCDMono2Bold',
		value: 'LCDMono2Bold',
	},
	{
		label: 'SimSun',
		value: 'SimSun',
	},
]
@Component
export default class VtextAttr extends Vue {
	@Prop() attrStyle: {}
	// 筛选框配置
	get formItems() {
		return [
			{
				key: 'fontFamily',
				label: '字体',
				bltype: 'select',
				transferClass: 'dark',
				options: fontFamilyOps,
			},
			{
				key: 'fontSize',
				label: '字体大小',
				bltype: 'inputnumber',
				min: 12,
				max: 68,
			},
			{
				key: 'fontWeight',
				label: '字体粗细',
				bltype: 'radio',
				type: 'button',
				options: [
					{ label: '正常', value: 'normal' },
					{ label: '加粗', value: 'bold' },
				],
			},
			{
				key: 'textAlign',
				label: '对齐方式',
				bltype: 'radio',
				type: 'button',
				transferClass: 'dark',
				options: [
					{ label: '居左', value: 'left' },
					{ label: '居中', value: 'center' },
					{ label: '居右', value: 'right' },
				],
			},
			{
				key: 'lineHeight',
				label: '行高',
				bltype: 'inputnumber',
				min: 1,
				max: 10,
				step: 0.2,
				precision: 1,
			},
			{
				key: 'color',
				label: '颜色',
				bltype: 'color',
				transferClass: 'dark',
			},
		]
	}
}
</script>

<style lang="scss" scoped></style>
