// 根据外观设置背景色设置图表颜色
// import { getStore } from '@utils'
import CommonStore from '@store/modules/common'

// 深浅主题色下的颜色变量
const COLOR_WITH_BG = {
	light: {
		lineColor: '#d8d8d8', // color-border-default 分割线，坐标轴线
		textColor: 'rgba(0, 0, 0, 0.85)', // color-text-primary 其它描述性文字颜色
		axisTextColor: 'rgba(0, 0, 0, 0.45)', // color-text-placeholder 坐标轴文字颜色
		areaColor: 'rgba(0, 0, 0, 0.25)', // 区域色
		tooltipBg: '#fff', // color-container-bg-popup tooltip 背景
		shadow: `box-shadow:
        0px 5px 12px 4px rgba(0, 0, 0, 0.09),
        0px 3px 6px 0px rgba(0, 0, 0, 0.12),
        0px 1px 2px -2px rgba(0, 0, 0, 0.16)`, // shadow-popup // 悬浮层的阴影
	},
	dark: {
		lineColor: '#595959',
		textColor: 'rgba(255, 255, 255, 0.85)',
		axisTextColor: 'rgba(255, 255, 255, 0.45)',
		areaColor: 'rgba(255, 255, 255, 0.25)',
		tooltipBg: '#1f1f1f',
		shadow: `box-shadow:
        0px 5px 12px 4px rgba(0, 0, 0, 0.36),
        0px 3px 6px 0px rgba(0, 0, 0, 0.48),
        0px 1px 2px -2px rgba(0, 0, 0, 0.64)`,
	},
}

// 蓝绿主题色下的图表颜色
// 所有主题色变量都是在以下颜色上进行透明度的调整实现的，在使用时可以更改透明度设置
// 例如：replace(/(.*), 1/, '$1, .4')
const COLOR_WITH_THEME = {
	green: {
		themePrimary: 'rgba(11, 100, 98, 1)',
		themeSecondary: 'rgba(7, 144, 135, 1)',
		themeTertiary: 'rgba(8, 68, 72, 1)',
	},
	blue: {
		themePrimary: 'rgba(5, 122, 255, 1)',
		themeSecondary: 'rgba(51, 146, 255, 1)',
		hemeTertiary: 'rgba(0, 107, 230, 1)',
	},
}

// 获取背景色下的颜色变量
export const getChartsColorWithBg = (bg = '') => {
	const background = bg || CommonStore.background || 'light'

	return COLOR_WITH_BG[background]
}

// 获取背景色下的颜色变量
export const getChartsColorWithTheme = () => {
	const theme = CommonStore.theme || 'green'

	return COLOR_WITH_THEME[theme]
}
