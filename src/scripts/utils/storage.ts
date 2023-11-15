import { getType } from './common'

//  ------------------------------------  localStorage  -----------------------------------------
/**
 * @desc localStorage 存储 item
 * @param {string} key
 * @param {string} val
 */
export const setStore = (key: string, val: any) => {
	// 判断 key,val 是否存在，val 为 undefined 时，getStore json.parse 取值会报错
	if (!key) throw new Error('key is undefined')
	if (!val && val !== 0) throw new Error('val is undefined')

	// 判断 key 的类型
	if (getType(key) !== 'string') throw new Error('key is not string')

	// 将数值转换为 string 类型存储
	val = JSON.stringify(val)
	// 编码保存
	val = window.btoa(encodeURIComponent(val))

	window.localStorage.setItem(key, val)
}

/**
 * @desc 获取 localStorage item
 * @param {string} key
 * @return {string | null} val
 */
export const getStore = (key: string): any => {
	if (!key) throw new Error('key is undefined')
	if (getType(key) !== 'string') throw new Error('key is not string')

	let val = window.localStorage.getItem(key)

	if (val) {
		// 解码
		val = window.atob(val)
		// 将 string 类型转化为初始类型
		val = JSON.parse(decodeURIComponent(val))

		return val
	} else {
		return ''
	}
}

/**
 * @desc 移除 localStorage 的某项
 * @param {string} key
 */
export const removeStore = (key: string) => {
	if (!key) throw new Error('key is undefined')
	if (getType(key) !== 'string') throw new Error('key is not string')

	window.localStorage.removeItem(key)
}

/**
 * @desc 清除所有 localStorage
 */
export const clearStore = () => {
	Object.keys(localStorage).forEach(key => {
		if (!key.includes('columns-')) {
			removeStore(key)
		}
	})
}
