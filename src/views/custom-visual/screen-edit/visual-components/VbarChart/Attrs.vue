<template>
	<ComChartAttrs type="bar" v-bind="$attrs">
		<Panel name="custom" slot="custom">
			<span>绘图区域</span>
			<div slot="content">
				<bl-form
					:formItems="customFormItems"
					:defaultValue="attrStyle.series"
					:label-width="70"
					itemSize="small"
					itemClass="mb-1" />
			</div>
		</Panel>
		<Panel name="series" slot="series">
			<span>系列设置</span>
			<div slot="content">
				<bl-form
					:formItems="seriesFormItems"
					:defaultValue="attrStyle.series"
					:label-width="70"
					itemSize="small"
					:labelColon="false"
					labelPosition="left"
					itemClass="mb-1"></bl-form>
			</div>
		</Panel>
	</ComChartAttrs>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ComChartAttrs from '../common/ComChartAttrs.vue'

// 组件属性

@Component({
	components: {
		ComChartAttrs,
	},
})
export default class VbarChartAttrs extends Vue {
	get attrStyle() {
		return this.$attrs.attrStyle
	}
	// 绘图区域
	get customFormItems() {
		return [
			{
				key: 'stack',
				label: '堆积',
				bltype: 'single-checkbox',
			},
			{
				key: 'barWidth',
				label: '柱条宽度',
				bltype: 'inputnumber',
				min: 5,
				max: 100,
			},
			{
				key: 'isGradient',
				label: '柱体渐变',
				bltype: 'single-checkbox',
			},
		]
	}

	// 系列设置
	get seriesFormItems() {
		return [
			{ key: 'labelShow', label: '标签', bltype: 'single-checkbox' },
			{ key: 'manMinValShow', label: '最值', bltype: 'single-checkbox' },
			{
				key: 'averageLineShow',
				label: '均值线',
				bltype: 'single-checkbox',
			},
		]
	}
}
</script>
