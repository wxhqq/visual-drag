<template>
	<div class="chart-wrap" ref="chartDom" v-on-echart-resize></div>
</template>

<script lang="ts">
import { ScreenComponent } from '@/store/modules/visual-screen'
import { BiComponent } from '@/store/modules/visual-dashboard'

import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import { CHART_COLOR_MAP } from '../../scripts/constants'
import { mergeToDefaultOptions } from '../../scripts/echart-options'
import { changeColorAlpha } from '@utils'
import { getChartsColorWithBg } from '@/plugins/echarts/common/get-charts-color'
const reqData = {
	axisData: ['2020', '2021', '2022', '2023'],
	series: [
		{
			name: '类别别类别1类别1类别1类别1',
			data: [321, 222, 323, 235], // 数据数组,对应 x 轴项的个数
		},
		{
			name: '类别2',
			data: [123, 345, 666, 342], // 数据数组
		},
		{
			name: '类别3',
			data: [22, 245, 366, 442], // 数据数组
		},
		{
			name: '类别4',
			data: [212, 545, 366, 542], // 数据数组
		},
	],
}
// 组件
@Component
export default class VlineChart extends Vue {
	@Prop() nodeInfo: ScreenComponent | BiComponent
	@Prop({ default: 'dark' }) skin: 'light' | 'dark' //皮肤  深浅
	@Ref('chartDom') chartDom: HTMLElement

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
			this.chartObj.dispose()
			this.chartObj = null
		})
	}

	// 更新图标配置
	updateChartOption() {
		const customOptions = this.getCustomOptions()

		this.chartObj.setOption(
			mergeToDefaultOptions(customOptions, 'line', this.skin),
			true
		)
	}

	// 获取自定义样式
	getCustomOptions() {
		const { legend, grid, xAxis, yAxis, colorType, tooltip, series } =
			this.nodeInfo.attrStyle
		// legend是否为水平
		const isHorizontalLegend = ['top', 'bottom'].includes(legend.position)
		// y轴单位
		const unit = yAxis.unit ? `(${yAxis.unit})` : ''

		const colorList = CHART_COLOR_MAP[colorType]
		// 根据主题 设置图表配色
		const { textColor } = getChartsColorWithBg(this.skin)
		return {
			legend: {
				show: legend.show,
				orient: isHorizontalLegend ? 'horizontal' : 'vertical',
				top: isHorizontalLegend ? legend.position : legend.top,
				left: isHorizontalLegend ? legend.left : legend.position,
			},
			grid,
			color: colorList,
			tooltip: {
				...tooltip,
				trigger: 'axis',
			},
			xAxis: {
				boundaryGap: false,
				show: xAxis.show,
				data: reqData.axisData,
				axisLine: {
					show: xAxis.lineShow,
				},
				axisLabel: {
					rotate: xAxis.labelRule === 'auto' ? 0 : -30,
				},
				axisTick: {
					show: xAxis.tickShow,
				},
				splitLine: {
					show: xAxis.splitLineShow,
				},
			},
			yAxis: {
				show: yAxis.show,
				name: yAxis.name + unit,
				axisLine: {
					show: yAxis.lineShow,
				},
				axisTick: {
					show: yAxis.tickShow,
				},
				splitLine: {
					show: yAxis.splitLineShow,
				},
			},
			series: reqData.series.map((item, index) => {
				const custom = {
					emphasis: {
						focus: 'series',
					},
					type: 'line',
					symbol: series.symbol,
					symbolSize: 6,
					connectNulls: series.connectNulls,
					smooth: series.smooth,
					label: {
						show: series.labelShow,
						color: textColor,
					},
				}

				if (series.chartType === 'area') {
					custom['stack'] = series.stack
					custom['areaStyle'] = {}

					if (series.isGradient) {
						const itemColor = colorList[index]
						custom['areaStyle']['color'] = {
							type: 'linear',
							x: 0,
							x2: 0,
							y: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: changeColorAlpha(
										itemColor,
										series.opacityTop / 100 || 0.2
									), // 0% 处的颜色
								},
								{
									offset: 1,
									color: changeColorAlpha(
										itemColor,
										series.opacityBottom / 100 || 0
									), // 100% 处的颜色
								},
							],
						}
					}
				}

				if (series.manMinValShow) {
					custom['markPoint'] = {
						data: [
							{ type: 'max', name: 'Max' },
							{ type: 'min', name: 'Min' },
						],
					}
				}
				if (series.averageLineShow) {
					custom['markLine'] = {
						data: [{ type: 'average', name: 'Avg' }],
						label: {
							color: textColor,
						},
					}
				}
				return {
					...custom,
					...item,
				}
			}),
		}
	}
}
</script>

<style lang="scss" scoped>
.chart-wrap {
	@include size(100%);
}
</style>
