import { getChartsColorWithBg } from '@/plugins/echarts/common/get-charts-color'
import { deepMerge } from '@/scripts/utils'
export type ChartType = 'line' | 'bar' | 'pie' | 'radar'

/**
 * 获取图表配置
 * @param options
 * @returns
 */
export const mergeToDefaultOptions = (
	options = {},
	type: ChartType,
	skin: 'light' | 'dark' = 'dark'
) => {
	// 根据主题 设置图表配色
	const {
		lineColor,
		textColor,
		axisTextColor,
		// areaColor,
		tooltipBg,
		shadow,
	} = getChartsColorWithBg(skin)

	const defaultOptions = {
		grid: {
			containLabel: true,
			left: 16,
			right: 16,
			bottom: 0,
			top: 16,
		},
		legend: {
			show: true,
			type: 'scroll',
			padding: [0, 0],
			itemGap: 24,
			itemWidth: 12,
			itemHeight: 12,
			textStyle: {
				padding: [2, 0, 0, 0], // 文本内边距，防止被遮盖
				color: textColor,
				fontSize: 12,
			},
			pageIconColor: 'rgba(9, 140, 132, 1)',
			pageTextStyle: {
				color: textColor,
			},
			formatter(name: string) {
				return name.length > 6 ? `${name.slice(0, 6)}...` : name
			},
		},

		tooltip: {
			appendToBody: true, // 防止溢出被隐藏调
			borderWidth: 1,
			backgroundColor: tooltipBg,
			borderColor: lineColor,
			// 边框阴影
			extraCssText: shadow,
			textStyle: {
				color: textColor,
			},
			axisPointer: {
				// 坐标轴指示器
				lineStyle: {
					color: lineColor,
				},
				shadowStyle: {
					color: 'rgba(255,255,255,0.1)',
				},
			},
		},
	}

	if (type === 'line' || type === 'bar') {
		// 获取数据后再显示 x 轴
		defaultOptions['xAxis'] = {
			type: 'category',
			// 坐标轴字体色
			axisLabel: {
				show: true,
				color: axisTextColor,
				lineHeight: 20,
				width: 100,
				overflow: 'truncate',
				rotate: 0,
			},
			// 坐标轴线颜色
			axisLine: {
				show: true,
				lineStyle: {
					color: lineColor,
				},
			},
			axisTick: {
				show: false,
			},
			splitLine: {
				show: false,
				lineStyle: {
					color: lineColor,
				},
			},
		}
		defaultOptions['yAxis'] = {
			name: '', // 纵坐标轴名称
			type: 'value',
			minInterval: 1, // 纵坐标不可为小数
			// 去掉纵坐标刻度线
			axisTick: {
				show: false,
			},
			// 坐标轴线颜色
			axisLine: {
				show: false,
				lineStyle: {
					color: lineColor,
				},
			},
			// 坐标轴字体颜色
			axisLabel: {
				show: true,
				color: axisTextColor,
			},
			// 纵轴的水平分割线
			splitLine: {
				show: true,
				lineStyle: {
					color: lineColor,
				},
			},
			// 坐标轴单位字体样式
			nameTextStyle: {
				color: textColor,
			},
		}
	}

	return deepMerge(defaultOptions, options)
}
