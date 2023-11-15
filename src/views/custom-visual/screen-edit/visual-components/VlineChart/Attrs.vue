<template>
	<ComChartAttrs type="line" v-bind="$attrs">
		<Panel name="custom" slot="custom">
			<span>绘图区域</span>
			<div slot="content">
				<bl-form
					:formItems="customFormItems"
					:defaultValue="attrStyle.series"
					:label-width="70"
					itemSize="small"
					:labelColon="false"
					labelPosition="left"
					itemClass="mb-1">
					<RadioGroup
						slot="symbol"
						type="button"
						v-model="attrStyle.series.symbol"
						size="small">
						<Radio label="emptyCircle">
							<span class="symbol-point empty-circle"></span>
						</Radio>
						<Radio label="circle">
							<span class="symbol-point circle"></span>
						</Radio>
						<Radio label="none">无</Radio>
					</RadioGroup>
				</bl-form>
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
export default class VlineChartAttrs extends Vue {
	get attrStyle() {
		return this.$attrs.attrStyle
	}
	// 绘图区域
	get customFormItems() {
		const { chartType, isGradient } = this.attrStyle['series']
		return [
			{
				key: 'chartType',
				label: '图表类型',
				bltype: 'radio',
				type: 'button',
				options: [
					{ value: 'line', label: '线图' },
					{ value: 'area', label: '面积图' },
				],
			},
			{ key: 'symbol', label: '标记点', bltype: 'slot' },
			{
				key: 'stack',
				label: '堆积',
				isHidden: chartType == 'line',
				bltype: 'single-checkbox',
			},
			{
				key: 'isGradient',
				label: '面积渐变',
				isHidden: chartType == 'line',
				bltype: 'single-checkbox',
			},
			{
				key: 'opacityTop',
				label: '透明度1',
				isHidden: chartType == 'line' || !isGradient,
				bltype: 'inputnumber',
				min: 0,
				max: 100,
			},
			{
				key: 'opacityBottom',
				label: '透明度2',
				isHidden: chartType == 'line' || !isGradient,
				bltype: 'inputnumber',
				min: 0,
				max: 100,
			},
			{
				key: 'smooth',
				label: '平滑曲线',
				bltype: 'single-checkbox',
			},
		]
	}
	// 系列设置
	get seriesFormItems() {
		return [
			{ key: 'labelShow', label: '标签', bltype: 'single-checkbox' },
			{
				key: 'connectNulls',
				label: '连接空值',
				bltype: 'single-checkbox',
			},
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
<style lang="scss" scoped>
.symbol-point {
	display: inline-block;
	@include size(12px);
	border-radius: 10px;
	&.circle {
		background: $color-white-45;
	}
	&.empty-circle {
		border: 2px solid $color-white-45;
	}
}
</style>
