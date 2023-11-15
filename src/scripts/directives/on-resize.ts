/**
 * element元素自适应大小
 */
import { throttle } from '../utils'
const elementResizeDetectorMaker = require('element-resize-detector')

const fn_name = '_vue_ele_resize_handler'

function bind(el: HTMLElement, binding: { value: (arg0: DOMRect) => void }) {
	unbind(el)
	el[fn_name] = throttle(() => {
		const elRect = el.getBoundingClientRect()
		if (typeof binding.value === 'function') {
			binding.value(elRect)
		}
	}, 200)
	// 监听绑定的div大小变化，更新大小
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
