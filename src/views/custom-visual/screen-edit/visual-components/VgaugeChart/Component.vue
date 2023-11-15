<template>
	<div class="chart-wrap" ref="chartDom" v-on-echart-resize></div>
</template>

<script lang="ts">
import { getChartsColorWithBg } from '@/plugins/echarts/common/get-charts-color'
import { BiComponent } from '@/store/modules/visual-dashboard'
import { ScreenComponent } from '@/store/modules/visual-screen'
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

const reqData = {
	value: 80,
	name: 'cpu',
}

// 组件
@Component
export default class VgaugeChart extends Vue {
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

		this.chartObj.setOption(customOptions)
	}

	// 获取自定义样式
	getCustomOptions() {
		let { radius, color, min, max, unit, isAlarm } =
			this.nodeInfo.attrStyle['series']

		const { lineColor, textColor, axisTextColor } = getChartsColorWithBg(
			this.skin
		)
		// 告警设置
		if (isAlarm) {
			color = this.getAlarmColor()
		}
		return {
			series: [
				{
					type: 'gauge',
					radius: `${radius || 90}%`,
					// splitNumber: 5,
					min: min || 0,
					max: max || 100,
					progress: {
						show: true,
					},
					axisLine: {
						lineStyle: {
							color: [[1, lineColor]],
						},
					},
					axisTick: {
						show: false,
					},
					splitLine: {
						length: 8,
						distance: 4,
						lineStyle: {
							width: 2,
							color: lineColor,
						},
					},
					axisLabel: {
						color: axisTextColor,
					},
					anchor: {
						show: true,
						showAbove: true,
						size: 16,
						itemStyle: {
							borderWidth: 6,
							borderColor: color,
						},
					},
					itemStyle: {
						color,
					},
					detail: {
						valueAnimation: true,
						offsetCenter: [0, '70%'],
						// color: textColor,
						color: 'inherit',
						formatter: (value: number) => {
							return `${value}{unit|${unit || ''}}`
						},
						rich: {
							unit: {
								fontSize: 14,
								color: axisTextColor,
								padding: [0, 0, -6, 6],
							},
						},
					},
					title: {
						offsetCenter: [0, '95%'],
						fontSize: 14,
						color: textColor,
					},
					data: [reqData],
				},
			],
		}
	}

	// 获取告警色值
	getAlarmColor() {
		let { color, max, alarmItem1, alarmItem2 } =
			this.nodeInfo.attrStyle['series']

		let alarmColor = ''
		if (alarmItem1.value) {
			const threshold = alarmItem1.value
				? ((max || 100) * alarmItem1.value) / 100
				: ''
			if (reqData.value >= threshold) {
				alarmColor = alarmItem1.color
			}
		}
		if (alarmItem2.value) {
			const threshold = alarmItem2.value
				? ((max || 100) * alarmItem2.value) / 100
				: ''
			if (reqData.value >= threshold) {
				alarmColor = alarmItem2.color
			}
		}

		color = alarmColor || color
		return color
	}
}
</script>

<style lang="scss" scoped>
.chart-wrap {
	@include size(100%);
}
</style>
