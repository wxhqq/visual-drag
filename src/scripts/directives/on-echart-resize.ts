/**
 * echart 图表自适应大小
 */
import echarts from '@/plugins/echarts'
const elementResizeDetectorMaker = require('element-resize-detector')
import { debounce } from '@utils'

const fn_name = '_vue_echarts_resize_handler'

function bind(el: HTMLElement) {
	unbind(el)
	el[fn_name] = debounce(() => {
		const chart = echarts.getInstanceByDom(el)
		if (!chart) {
			return
		}
		chart.resize()
	}, 200)
	// 监听绑定的div大小变化，更新echarts大小
	elementResizeDetectorMaker().listenTo(el, el[fn_name])
}
function unbind(el: HTMLElement) {
	elementResizeDetectorMaker().removeListener(el, el[fn_name])
	delete el[fn_name]
}
export default {
	bind,
	unbind,
}
