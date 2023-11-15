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
	series: [
		{ value: 678, name: 'Search Engine' },
		{ value: 735, name: 'Direct' },
		{ value: 580, name: 'Email' },
		{ value: 484, name: 'Union Ads' },
		{ value: 300, name: 'Video Ads' },
	],
}

// 组件
@Component
export default class VpieChart extends Vue {
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
			mergeToDefaultOptions(customOptions, 'pie', this.skin),
			true
		)
	}

	// 获取自定义样式
	getCustomOptions() {
		const { legend, colorType, tooltip, series } = this.nodeInfo.attrStyle
		// legend是否为水平
		const isHorizontalLegend = ['top', 'bottom'].includes(legend.position)

		const { radiusPercent, isRing, ringWidth, labelContent, labelPostion } =
			series

		// label标签格式化
		let formatterLabel = ''
		if (labelContent.includes('name')) {
			formatterLabel = '{b}'
			if (labelContent.length > 1) {
				formatterLabel += '\n'
			}
		}
		if (labelContent.includes('value')) {
			formatterLabel += '{val|{c}}'
		}
		if (labelContent.includes('percent')) {
			formatterLabel += '{val|({d}%)}'
		}

		// 标签是否在内部
		const isInsidePos = labelPostion == 'inside' //label位置是否在内部
		// 根据主题 设置图表配色
		const { textColor } = getChartsColorWithBg(this.skin)
		return {
			legend: {
				show: legend.show,
				orient: isHorizontalLegend ? 'horizontal' : 'vertical',
				top: isHorizontalLegend ? legend.position : legend.top,
				left: isHorizontalLegend ? legend.left : legend.position,
			},
			color: CHART_COLOR_MAP[colorType],
			tooltip,
			series: [
				{
					type: 'pie',
					radius: isRing
						? [`${radiusPercent - ringWidth}%`, `${radiusPercent}%`]
						: `${radiusPercent}%`,
					percentPrecision: series.percentPrecision,
					center: [`${series.centerLeft || 50}%`, '50%'],
					roseType: series.roseType,
					label: {
						show: series.labelShow,
						color: textColor,
						position: isInsidePos ? 'inside' : 'outside',
						alignTo: labelPostion == 'edge' ? 'edge' : 'none',
						formatter: formatterLabel,
						minMargin: 5,
						edgeDistance: 16,
						lineHeight: labelPostion == 'edge' ? 18 : 14,
						rich: {
							val: {
								color: isInsidePos ? '#555' : '#999',
							},
						},
					},
					labelLayout: (params: any) => {
						if (labelPostion !== 'edge') return
						const isLeft =
							params.labelRect.x < this.chartObj.getWidth() / 2
						const points = params.labelLinePoints
						points[2][0] = isLeft
							? params.labelRect.x
							: params.labelRect.x + params.labelRect.width
						return {
							labelLinePoints: points,
						}
					},
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
