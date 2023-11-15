<template>
	<div class="chart-wrap" ref="chartDom" v-on-echart-resize></div>
</template>

<script lang="ts">
import { getChartsColorWithBg } from '@/plugins/echarts/common/get-charts-color'
import { BiComponent } from '@/store/modules/visual-dashboard'
import { ScreenComponent } from '@/store/modules/visual-screen'
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import { CHART_COLOR_MAP } from '../../scripts/constants'
import { mergeToDefaultOptions } from '../../scripts/echart-options'

const reqData = {
	radarIndicator: [
		{ name: '销售' },
		{ name: '管理' },
		{ name: '信息技术' },
		{ name: '客服' },
		{ name: '研发' },
		{ name: '市场' },
	],
	series: [
		{
			value: [4200, 3000, 20000, 35000, 50000, 18000],
			name: 'Allocated Budget',
		},
		{
			value: [5000, 14000, 28000, 26000, 42000, 21000],
			name: 'Actual Spending',
		},
	],
}

// 组件
@Component
export default class VradarChart extends Vue {
	@Prop() nodeInfo: ScreenComponent | BiComponent
	@Ref('chartDom') chartDom: HTMLElement
	@Prop({ default: 'dark' }) skin: 'light' | 'dark' //皮肤  深浅
	chartObj: any = null

	// 样式改变
	@Watch('nodeInfo.attrStyle', { deep: true })
	onStyleChange() {
		this.updateChartOption()
	}

	// 背景改变
	@Watch('skin')
	onSkinChange() {
		this.updateChartOption()
	}

	mounted() {
		this.chartObj = this.$echarts.init(this.chartDom)
		this.updateChartOption()

		this.$once('hook:beforeDestroy', () => {
			this.chartObj?.dispose()
			this.chartObj = null
		})
	}

	// 更新图标配置
	updateChartOption() {
		const customOptions = this.getCustomOptions()

		this.chartObj.setOption(
			mergeToDefaultOptions(customOptions, 'radar', this.skin),
			true
		)
	}

	// 获取自定义样式
	getCustomOptions() {
		const { legend, colorType, tooltip, series } = this.nodeInfo.attrStyle
		// legend是否为水平
		const isHorizontalLegend = ['top', 'bottom'].includes(legend.position)
		// 根据主题 设置图表配色
		const { lineColor, textColor, axisTextColor } = getChartsColorWithBg(
			this.skin
		)
		return {
			legend: {
				show: legend.show,
				orient: isHorizontalLegend ? 'horizontal' : 'vertical',
				top: isHorizontalLegend ? legend.position : legend.top,
				left: isHorizontalLegend ? legend.left : legend.position,
			},
			color: CHART_COLOR_MAP[colorType],
			tooltip,
			radar: {
				indicator: reqData.radarIndicator,
				shape: series.shape,
				center: [`${series.centerLeft || 50}%`, '50%'],
				radius: `${series.radiusPercent || 50}%`,
				splitArea: {
					areaStyle: {
						color: ['rgba(5, 122, 255, 0)', 'rgba(5, 122, 255, 0)'],
						shadowColor: 'rgba(0, 0, 0, 0.2)',
						shadowBlur: 10,
					},
				},
				axisName: {
					color: axisTextColor,
				},
				splitLine: {
					lineStyle: {
						color: lineColor,
					},
				},
				axisLine: {
					lineStyle: {
						color: lineColor,
					},
				},
			},
			series: [
				{
					type: 'radar',
					label: {
						show: series.labelShow,
						color: textColor,
					},
					areaStyle: series.isArea ? {} : null,
					data: reqData.series,
				},
			],
		}
	}
}
</script>

<style lang="scss" scoped>
.chart-wrap {
	@include size(100%);
}
</style>
