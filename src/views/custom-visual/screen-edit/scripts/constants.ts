import { deepClone, deepMerge } from '@/scripts/utils'
// 形状样式
export const shapeStyleKeys = ['left', 'top', 'width', 'height']
// 组件图标映射
export const componentIconMap = {
	Vtext: 'bl-icon-text',
	Vgroup: 'bl-icon-fold',
	Vtable: 'bl-icon-table',
	Vbutton: 'bl-icon-button',
	Vlist: 'bl-icon-list',
	Vcontainer: 'bl-icon-container',
	Vimg: 'bl-icon-pic-save',

	// 图表
	VgaugeChart: 'bl-icon-zhibiao',
	VlineChart: 'bl-icon-zhexiantu',
	VbarChart: 'bl-icon-zhuzhuangtu',
	VpieChart: 'bl-icon-bingtu',
	VradarChart: 'bl-icon-leidatu',
}

// 数据字段类型图标映射
export const dataFiledTypeIconMap = {
	number: 'bl-icon-shuju',
	string: 'bl-icon-zifuchuan',
	datetime: 'bl-icon-zu',
	year: 'bl-icon-nian',
	'year-month': 'bl-icon-yue',
	'year-month-day': 'bl-icon-ri',
	hour: 'bl-icon-shi',
	'hour-minute': 'bl-icon-fen',
	'hour-minute-second': 'bl-icon-miao',
}

/**
 * 基础图表组件
 */
export const ALL_COMPONENT_MAP = {
	// 折线图
	VlineChart: {
		label: '折线图',
		component: 'VlineChart',
		propStyle: {
			left: 0,
			top: 0,
			width: 400,
			height: 300,
		},
		attrStyle: {
			colorType: '1', //调色盘
			grid: {
				left: 16,
				right: 16,
				bottom: 0,
				top: 30,
			},
			legend: {
				show: true,
				position: 'top', //与折线图配置不一致   top, left, right, bottom
				left: 'center', // left,center, right
				top: 'middle', //top, middle, bottom
			},
			tooltip: {
				show: true,
			},
			xAxis: {
				show: true,
				labelRule: 'auto', //rotate  auto
				tickShow: false,
				splitLineShow: false,
			},
			yAxis: {
				show: true,
				name: '',
				unit: '',
				labelRule: 'auto', //rotate  auto
				lineShow: false,
				tickShow: false,
				splitLineShow: true,
			},
			series: {
				// 绘图
				chartType: 'line', //line area
				stack: false, //是否堆积
				isGradient: true,
				opacityTop: 20, //渐变透明度 0-100%
				opacityBottom: 0, //渐变透明度 0-100%
				smooth: false, //平滑曲线

				// 系列
				symbol: 'emptyCircle', //none 'circle', 'emptyCircle'
				connectNulls: false, //false
				labelShow: false, //是否显示标签
				manMinValShow: false, //是否显示最值
				averageLineShow: false, //是否显示均值线
			},
		},
	},
	// 状态图
	VbarChart: {
		label: '柱状图',
		component: 'VbarChart',
		propStyle: {
			left: 0,
			top: 0,
			width: 400,
			height: 300,
		},
		attrStyle: {
			colorType: '1', //调色盘
			grid: {
				left: 16,
				right: 16,
				bottom: 0,
				top: 30,
			},
			legend: {
				show: true,
				position: 'top', //与折线图配置不一致   top, left, right, bottom
				left: 'center', // left,center, right
				top: 'middle', //top, middle, bottom
			},
			tooltip: {
				show: true,
			},
			xAxis: {
				show: true,
				type: 'category',
				labelRule: 'auto', //rotate  auto
				tickShow: false,
				lineShow: true,
				splitLineShow: false,
			},
			yAxis: {
				show: true,
				type: 'value',
				name: '',
				unit: '',
				labelRule: 'auto', //rotate  auto
				lineShow: false,
				tickShow: false,
				splitLineShow: true,
			},
			series: {
				// 绘图
				stack: false, //是否堆积
				barWidth: null,
				isGradient: false, //是否渐变
				// 系列
				labelShow: false, //是否显示标签
				manMinValShow: false, //是否显示最值
				averageLineShow: false, //是否显示均值线
			},
		},
	},
	// 饼图
	VpieChart: {
		label: '饼状图',
		component: 'VpieChart',
		propStyle: {
			left: 0,
			top: 0,
			width: 400,
			height: 300,
		},
		attrStyle: {
			colorType: '1', //调色盘
			legend: {
				show: true,
				position: 'top', //与折线图配置不一致   top, left, right, bottom
				left: 'center', // left,center, right
				top: 'middle', //top, middle, bottom
			},
			tooltip: {
				show: true,
			},
			series: {
				radiusPercent: 65, //半径占比
				isRing: false, //是否为环状图
				ringWidth: 20, //环宽 5-40
				centerLeft: 50, //饼图相对左侧距离
				roseType: false, //是否为玫瑰图
				labelShow: true,
				percentPrecision: 2, //占比精度
				labelContent: ['name', 'value'], //name 名称  value值  percent百分比
				labelPostion: 'edge', //edge, outside inside
			},
		},
	},
	// 雷达图
	VradarChart: {
		label: '雷达图',
		component: 'VradarChart',
		propStyle: {
			left: 0,
			top: 0,
			width: 400,
			height: 300,
		},
		attrStyle: {
			colorType: '1', //调色盘
			grid: {
				left: 16,
				right: 16,
				bottom: 16,
				top: 16,
			},
			legend: {
				show: true,
				position: 'top', //与折线图配置不一致   top, left, right, bottom
				left: 'center', // left,center, right
				top: 'middle', //top, middle, bottom
			},
			tooltip: {
				show: true,
			},
			series: {
				shape: 'polygon', //形状 圆形circle  多边形polygon
				isArea: false, //面积填充
				radiusPercent: 65, //半径占比
				centerLeft: 50, //饼图相对左侧距离
				labelShow: false,
			},
		},
	},
	// 仪表盘
	VgaugeChart: {
		label: '仪表盘',
		component: 'VgaugeChart',
		propStyle: {
			left: 0,
			top: 0,
			width: 400,
			height: 300,
		},
		attrStyle: {
			series: {
				min: 0,
				max: 100,
				radius: 100,
				color: '#5470c6',
				unit: '',
				isAlarm: false,
				alarmItem1: {
					value: '',
					color: '',
				},
				alarmItem2: {
					value: '',
					color: '',
				},
			},
		},
	},
	// 图片
	Vimg: {
		label: '图片',
		component: 'Vimg',
		propStyle: {
			left: 0,
			top: 0,
			width: 300,
			height: 300,
		},
		attrStyle: {
			url: '', //图片地址
			displayType: 'fit', //显示方式 fit flat center cover full
		},
	},
	// 表格
	Vtable: {
		label: '表格',
		component: 'Vtable',
		propStyle: {
			left: 0,
			top: 0,
			width: 600,
			height: 300,
		},
		attrStyle: {
			tableTheme: 'stripe', //stripe  border  simple
		},
	},
	// 文本
	Vtext: {
		label: '文本',
		component: 'Vtext',
		propData: {
			text: '双击修改文本',
		},
		propStyle: {
			left: 0,
			top: 0,
			width: 200,
			height: 28,
		},
		attrStyle: {
			fontFamily: 'MicrosoftYaHeiUI',
			fontSize: 14,
			fontWeight: 'normal',
			lineHeight: 1,
			letterSpacing: 0,
			textAlign: 'left',
			color: '#fff',
		},
	},
	Vcontainer: {
		label: '容器',
		component: 'Vcontainer',
		propStyle: {
			left: 0,
			top: 0,
			width: 406,
			height: 300,
		},
		attrStyle: {
			text: '标题1',
			align: 'center', //left right  center
		},
	},
}
/**
 * 通用组件 存在wrapStyle
 * @param page 页面类型
 * @returns
 */
export const getCommonComponents = () => {
	const res = [
		{
			title: '素材',
			components: [
				{
					...ALL_COMPONENT_MAP.Vimg,
					icon: 'bl-icon-pic-save',
				},
				{
					...ALL_COMPONENT_MAP.Vcontainer,
					icon: 'bl-icon-container',
				},
			],
		},
		{
			title: '文本',
			components: [
				{
					...ALL_COMPONENT_MAP.Vtext,
					icon: 'bl-icon-text',
				},
			],
		},
	]
	return res
}
/**
 * 图表组件
 * @param page 页面类型
 * @returns
 */
export const getChartsCompnents = (page: 'screen' | 'dashboard' = 'screen') => {
	const res = [
		{
			title: '表格',
			components: [
				{ ...ALL_COMPONENT_MAP.Vtable, icon: 'bl-icon-biaoge' },
			],
		},
		{
			title: '指标',
			components: [
				{
					...ALL_COMPONENT_MAP.VgaugeChart,
					icon: 'bl-icon-zhibiao',
				},
			],
		},
		{
			title: '折线图',
			components: getLingChartExtension(),
		},
		{
			title: '柱状图',
			components: getBarChartExtension(),
		},
		{
			title: '饼状图',
			components: getPieChartExtension(),
		},
		{
			title: '雷达图',
			components: getRadarChartExtension(),
		},
	]
	res.map(item => {
		item.components.forEach(ele => {
			ele['dataConfigs'] = {
				dimensions: [],
				measures: [],
				filters: [],
				autoRefresh: false,
				refreshRate: 10,
				unit: 'second', //秒:second，分:minute
				resultNum: 100, //展示结果
			}
			if (page === 'dashboard') {
				ele['wrapStyle'] = {
					showTitle: true,
					cardBgColor: '',
				}
			}
		})
	})
	return res
}

// 图表调色盘
export const CHART_COLOR_MAP = {
	1: [
		'rgba(0, 255, 230, 1)',
		'rgba(25, 118, 210, 1)',
		'rgba(0, 200, 83, 1)',
		'rgba(179, 136, 255, 1)',
		'rgba(0, 151, 167, 1)',
		'rgba(249, 168, 37, 1)',
		'rgba(129, 199, 132, 1)',
		'rgba(68, 138, 255, 1)',
		'rgba(234, 128, 252, 1)',
		'rgba(255, 234, 0, 1)',
		'rgba(126, 87, 194, 1)',
		'rgba(85, 139, 47, 1)',
		'rgba(192, 202, 51, 1)',
		'rgba(94, 53, 177, 1)',
		'rgba(225, 190, 231, 1)',
		'rgba(79, 195, 247, 1)',
	],
	2: [
		'rgba(54, 188, 203, 1)',
		'rgba(2, 93, 244, 1)',
		'rgba(246, 189, 22, 1)',
		'rgba(114, 98, 253, 1)',
		'rgba(214, 75, 192, 1)',
		'rgba(246, 144, 61, 1)',
		'rgba(0, 134, 133, 1)',
		'rgba(219, 107, 207, 1)',
		'rgba(160, 220, 44, 1)',
		'rgba(150, 97, 188, 1)',
		'rgba(240, 139, 180, 1)',
		'rgba(159, 180, 15, 1)',
	],
	3: [
		'rgba(0, 114, 110, 1)',
		'rgba(45, 168, 255, 1)',
		'rgba(127, 55, 252, 1)',
		'rgba(255, 115, 173, 1)',
		'rgba(111, 220, 140, 1)',
		'rgba(250, 77, 86, 1)',
		'rgba(69, 137, 255, 1)',
		'rgba(209, 39, 113, 1)',
		'rgba(210, 161, 6, 1)',
		'rgba(8, 189, 186, 1)',
		'rgba(186, 78, 0, 1)',
		'rgba(212, 187, 255, 1)',
	],
	4: [
		'rgba(0, 93, 93, 1)',
		'rgba(17, 146, 232, 1)',
		'rgba(105, 41, 196, 1)',
		'rgba(159, 24, 83, 1)',
		'rgba(25, 128, 56, 1)',
		'rgba(250, 77, 86, 1)',
		'rgba(0, 45, 156, 1)',
		'rgba(87, 4, 8, 1)',
		'rgba(178, 134, 0, 1)',
		'rgba(0, 157, 154, 1)',
		'rgba(138, 56, 0, 1)',
		'rgba(165, 110, 255, 1)',
	],
	5: [
		'rgba(49, 19, 94, 1)',
		'rgba(73, 29, 139, 1)',
		'rgba(105, 41, 196, 1)',
		'rgba(138, 63, 252, 1)',
		'rgba(165, 110, 255, 1)',
		'rgba(190, 149, 255, 1)',
		'rgba(212, 187, 255, 1)',
		'rgba(232, 218, 255, 1)',
	],
	6: [
		'rgba(0, 29, 108, 1)',
		'rgba(0, 45, 156, 1)',
		'rgba(0, 67, 220, 1)',
		'rgba(15, 98, 254, 1)',
		'rgba(69, 137, 255, 1)',
		'rgba(120, 169, 255, 1)',
		'rgba(166, 200, 255, 1)',
		'rgba(208, 226, 255, 1)',
	],
	7: [
		'rgba(2, 43, 48, 1)',
		'rgba(0, 65, 68, 1)',
		'rgba(0, 93, 93, 1)',
		'rgba(0, 125, 121, 1)',
		'rgba(0, 157, 154, 1)',
		'rgba(8, 189, 186, 1)',
		'rgba(61, 219, 217, 1)',
		'rgba(158, 240, 240, 1)',
	],
	8: [
		'rgba(62, 26, 0, 1)',
		'rgba(94, 41, 0, 1)',
		'rgba(138, 56, 0, 1)',
		'rgba(186, 78, 0, 1)',
		'rgba(235, 98, 0, 1)',
		'rgba(255, 131, 43, 1)',
		'rgba(255, 183, 132, 1)',
		'rgba(255, 217, 190, 1)',
	],
	9: [
		'rgba(87, 4, 8, 1)',
		'rgba(117, 14, 19, 1)',
		'rgba(162, 25, 31, 1)',
		'rgba(218, 30, 40, 1)',
		'rgba(250, 77, 86, 1)',
		'rgba(255, 131, 137, 1)',
		'rgba(255, 179, 184, 1)',
		'rgba(255, 215, 217, 1)',
	],
}

/**
 * *************************************图表延伸********************************************
 */
// 折线图延伸
const getLingChartExtension = () => {
	const chartInfo = ALL_COMPONENT_MAP.VlineChart
	return [
		// 基础折线图
		{ ...chartInfo, icon: 'bl-icon-zhexiantu' },
		// 面积折线图
		deepMerge(deepClone(chartInfo), {
			label: '面积图',
			icon: 'bl-icon-mianjitu',
			attrStyle: {
				series: {
					chartType: 'area', //line area
				},
			},
		}),
		// 堆积图
		deepMerge(deepClone(chartInfo), {
			label: '堆积面积图',
			icon: 'bl-icon-duijimianjitu',
			attrStyle: {
				series: {
					chartType: 'area', //line area
					stack: true, //是否堆积
				},
			},
		}),
	]
}
// 柱状图延伸
const getBarChartExtension = () => {
	const chartInfo = ALL_COMPONENT_MAP.VbarChart
	return [
		// 基础柱状图
		{ ...chartInfo, icon: 'bl-icon-zhuzhuangtu' },
		// 堆积柱状图
		deepMerge(deepClone(chartInfo), {
			label: '堆积柱状图',
			icon: 'bl-icon-duijizhuzhuangtu',
			attrStyle: {
				series: {
					stack: true,
				},
			},
		}),
		// 条形图
		deepMerge(deepClone(chartInfo), {
			label: '条形图',
			icon: 'bl-icon-tiaoxingtu',
			attrStyle: {
				xAxis: {
					type: 'value',
					lineShow: false,
					splitLineShow: true,
				},
				yAxis: {
					type: 'category',
					splitLineShow: false,
				},
			},
		}),
		// 堆积条形图
		deepMerge(deepClone(chartInfo), {
			label: '堆积条形图',
			icon: 'bl-icon-duijitiaoxingtu',
			attrStyle: {
				xAxis: {
					type: 'value',
					lineShow: false,
					splitLineShow: true,
				},
				yAxis: {
					type: 'category',
					splitLineShow: false,
				},
				series: {
					stack: true,
				},
			},
		}),
	]
}
// 饼图延伸
const getPieChartExtension = () => {
	const chartInfo = ALL_COMPONENT_MAP.VpieChart
	return [
		// 基础饼状图
		{ ...chartInfo, icon: 'bl-icon-bingtu' },
		// 环状饼图
		deepMerge(deepClone(chartInfo), {
			label: '环状图',
			icon: 'bl-icon-huanxingtu',
			attrStyle: {
				series: {
					isRing: true,
				},
			},
		}),
		// 玫瑰图
		deepMerge(deepClone(chartInfo), {
			label: '玫瑰图',
			icon: 'bl-icon-meiguitu',
			attrStyle: {
				series: {
					roseType: 'radius',
				},
			},
		}),
	]
}
// 雷达图延伸
const getRadarChartExtension = () => {
	const chartInfo = ALL_COMPONENT_MAP.VradarChart
	return [
		// 基础雷达图
		{ ...chartInfo, icon: 'bl-icon-leidatu' },
		// 圆形雷达图
		deepMerge(deepClone(chartInfo), {
			label: '圆形雷达图',
			icon: 'bl-icon-yuanxingleidatu',
			attrStyle: {
				series: {
					shape: 'circle',
				},
			},
		}),
	]
}
