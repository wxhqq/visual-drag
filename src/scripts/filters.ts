import {
	getType,
	formatLocalISOTime as formatLocalISOTimeFn,
	convertByteUnit as convertByteUnitFn,
} from '@utils'

import * as constantMap from '@constants'

// -----------------------------  数字处理   -------------------------
// 数字千分位添加分隔符
export const thousandsSplit = (num: number | string) => {
	if (getType(num) !== 'number') return num

	const res =
		num.toString().indexOf('.') !== -1
			? num.toLocaleString()
			: num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
	return res
}

// 转换byte 单位
export const convertByteUnit = convertByteUnitFn

//  -----------------------------   时间  ----------------------------
/**
 * @example
 *  isoTime = '2018-08-22T21:16:01.752076+08:00'
 *  formatLocalISOTime(isoTime)  // 2018-08-22 21:16:01
 *  formatLocalISOTime(isoTime, date)  // 2018-08-22
 *  formatLocalISOTime(isoTime, time)  // 21:16:01
 */
export const formatLocalISOTime = formatLocalISOTimeFn

/**
 * 通用的转化方式
 * mapName:常量map 名称
 * type：string number（默认为string ，当val为true/false，map的key为数字时， 需转化）
 */
export const convertFiled = (
	val: string | number,
	mapName: string,
	type = 'string'
) => {
	if (type === 'number') {
		val = +val
	}

	if ((!val && val !== 0) || !constantMap[mapName]) {
		return ''
	}
	return constantMap[mapName][val] || val
}
