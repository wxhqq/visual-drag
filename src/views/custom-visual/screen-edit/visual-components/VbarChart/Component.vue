<template>
	<div class="chart-wrap" ref="chartDom" v-on-echart-resize></div>
</template>

<script lang="ts">
import { getChartsColorWithBg } from '@/plugins/echarts/common/get-charts-color'
import { changeColorAlpha } from '@/scripts/utils'
import { ScreenComponent } from '@/store/modules/visual-screen'
import { BiComponent } from '@store/modules/visual-dashboard'

import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import { CHART_COLOR_MAP } from '../../scripts/constants'
import { mergeToDefaultOptions } from '../../scripts/echart-options'

const reqData = {
	axisData: ['2020', '2021', '2022', '2023'],
	series: [
		{
			name: '类别别类别1类别1类别1类别1',
			type: 'bar', // 线
			data: [321, 222, 323, 235], // 数据数组,对应 x 轴项的个数
		},
		{
			name: '类别2',
			type: 'bar', // 线
			data: [123, 345, 666, 342], // 数据数组
		},
		{
			name: '类别3',
			type: 'bar', // 线
			data: [189, 245, 366, 442], // 数据数组
		},
	],
}

// 组件
@Component
export default class VbarChart extends Vue {
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
			mergeToDefaultOptions(customOptions, 'bar', this.skin),
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
		// 根据主题 设置图表配色
		const { textColor } = getChartsColorWithBg(this.skin)

		const res = {
			legend: {
				show: legend.show,
				orient: isHorizontalLegend ? 'horizontal' : 'vertical',
				top: isHorizontalLegend ? legend.position : legend.top,
				left: isHorizontalLegend ? legend.left : legend.position,
			},
			grid,
			color: CHART_COLOR_MAP[colorType],
			tooltip: {
				...tooltip,
				trigger: 'axis',
				axisPointer: {
					type: 'shadow',
				},
			},
			xAxis: {
				type: xAxis.type,
				boundaryGap: true,
				show: xAxis.show,
				axisLabel: {
					rotate: xAxis.labelRule === 'auto' ? 0 : -30,
				},
				axisLine: {
					show: xAxis.lineShow,
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
				type: yAxis.type,
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
					type: 'bar',
					barMaxWidth: 28,
					stack: series.stack,
					barWidth: series.barWidth || null,
					label: {
						show: series.labelShow,
						color: textColor,
						position: 'top',
					},
				}
				if (series.isGradient) {
					const itemColor = CHART_COLOR_MAP[colorType][index]
					custom['itemStyle'] = {
						color: {
							type: 'linear',
							x: 0,
							x2: 0,
							y: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: changeColorAlpha(itemColor, 0.9), // 0% 处的颜色
								},
								{
									offset: 1,
									color: changeColorAlpha(itemColor, 0.1), // 100% 处的颜色
								},
							],
						},
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

		if (xAxis.type === 'category') {
			res.xAxis['data'] = reqData.axisData
		} else {
			res.yAxis['data'] = reqData.axisData
		}

		return res
	}
}
</script>

<style lang="scss" scoped>
.chart-wrap {
	@include size(100%);
}
</style>
