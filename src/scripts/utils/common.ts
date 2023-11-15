// -------------------------------  其它工具方法  ----------------------------
/**
 * @desc 获取变量数据类型
 * @param {any} val
 * @return {string} type
 */
export const getType = <T>(val: T) => {
	const type = Object.prototype.toString.call(val).slice(8, -1).toLowerCase()

	return type
}

/**
 * 文件大小 字节转换单位
 * @param size
 * @returns {string|*}
 */
export const convertByteUnit = (size: number): string => {
	if (getType(size) !== 'number') return ''
	if (size < pow1024(1)) return `${size} B`
	if (size < pow1024(2)) return `${(size / pow1024(1)).toFixed(2)} KB`
	if (size < pow1024(3)) return `${(size / pow1024(2)).toFixed(2)} MB`
	if (size < pow1024(4)) return `${(size / pow1024(3)).toFixed(2)} GB`
	return `${(size / pow1024(4)).toFixed(2)} TB`
}

// 求次幂
function pow1024(num: number) {
	return Math.pow(1024, num)
}

// -------------------------  拼接批量操作请求 url 查询参数字段 ----------------------
/**
 * 将数据拼接成请求参数
 * @param { Set|Object } params id 集合 或 筛选条件参数
 * @return { string } 请求参数 test?(id=1&id=2) 括号部分
 */
export const getQueryParamStr = <T>(params: T): string => {
	let paramStr = '' // 拼接所有选择 id 成为一个字符串
	switch (getType(params)) {
		case 'set': // 拼接 id 的 set 集合
			for (const id of params['values']()) {
				paramStr = `${paramStr}id=${id}&`
			}
			break
		case 'object': // 拼接筛选条件参数
			Object.keys(params).map(key => {
				paramStr = `${paramStr}${key}=${params[key]}&`
			})
			break
		case 'array': // 条件参数为数组
			paramStr = params['reduce']((pre: any, cur: any) => {
				return `${pre}id=${cur}&`
			}, '')
			break
	}
	paramStr = paramStr.slice(0, -1) // 删除最后一个 &

	return paramStr
}

// ----------------------------------  防抖、节流函数  -----------------
/**
 * 节流函数
 * @param { function }  fn节流执行的函数
 * @param { number } gap 间隔时间 毫秒
 * @return { String } 过滤掉 html 标签的字符串
 */
export const throttle = (fn: { (): void; apply?: any }, gap = 0) => {
	let startTime = new Date().valueOf()
	let timer: NodeJS.Timeout | null = null

	return function <T>(...params: T[]) {
		const context = this
		const args = params
		const curTime = new Date().valueOf()

		timer && clearTimeout(timer)
		if (curTime - startTime >= gap) {
			fn.apply(context, args)
			startTime = curTime
		} else {
			timer = setTimeout(function () {
				fn.apply(context, args)
			}, gap)
		}
	}
}

/**
 * 防抖函数
 * @param { function }  fn 防抖执行的函数
 * @param { number } delay 间隔时间 毫秒
 * @return { function }
 */
export const debounce = function (func: any, wait = 50, immediate = false) {
	// 缓存一个定时器id
	let timer: NodeJS.Timeout | null = null
	// 这里返回的函数时每次用户实际调用的防抖函数
	return function <T>(...args: T[]) {
		// 如果已经设定过定时器了就清空上一次的定时器
		if (timer) clearTimeout(timer)
		if (immediate) {
			const callNow = !timer
			//等待wait的时间间隔后，timer为null的时候，函数才可以继续执行
			timer = setTimeout(() => {
				timer = null
			}, wait)
			//未执行过，执行
			if (callNow) func.apply(this, args)
		} else {
			// 开始一个定时器，延迟执行用户传入的方法
			timer = setTimeout(() => {
				//将实际的this和参数传入用户实际调用的函数
				func.apply(this, args)
			}, wait)
		}
	}
}

// ----------------------------------- 转换函数 ------------------------------------
/**
 * @method transObjToOptions
 * @desc 将对象转换成下拉选项列表的可选 options, label为 obj 的 value, value 为 obj 的 key
 * @param { object } obj 源对象
 * @param { string } type options 的 value 的类型（默认为string）
 * @returns { array } 转换后的可用于下拉选项 options 的数组 [{label: '', value: ''}]
 */
export const transObjToOptions = <T>(
	obj: T,
	type = 'string',
	excludeObjKeysArr: string[] = []
) => {
	if (getType(obj) !== 'object') throw new Error('Parameter is not object')

	// 排除的对象键名数组长度
	const len = excludeObjKeysArr.length
	const options: { label: any; value: any }[] = []

	Object.keys(obj).map(key => {
		if (len === 0 || excludeObjKeysArr.indexOf(key) === -1) {
			let value

			if (type === 'number') {
				value = +key
			} else if (type === 'boolean') {
				value = Boolean(+key)
			} else if (type === 'label') {
				value = obj[key]
			} else {
				value = key
			}

			options.push({
				label: obj[key],
				value,
			})
		}
	})

	return options
}

/**
 * @method deepClone
 * 深拷贝
 * @param { object } obj 源对象
 */
export const deepClone = (data: Record<string, any> | any[]) => {
	const type = getType(data)
	let res

	if (type === 'array') {
		res = []
	} else if (type === 'object') {
		res = {}
	} else {
		return data
	}

	if (type === 'array') {
		for (let i = 0; i < data['length']; i++) {
			res['push'](deepClone(data[i]))
		}
	} else if (type === 'object') {
		for (const i in data) {
			res[i] = deepClone(data[i])
		}
	}

	return res
}
/**
 * 对象深度合并
 * @param {Object} obj1 被合并对象
 * @param {Object} obj2 合并对象
 * @returns
 */
export const deepMerge = (
	obj1: Record<string, any>,
	obj2: Record<string, any>
) => {
	for (const key in obj2) {
		// 如果target(也就是obj1[key])存在，且是对象的话再去调用deepMerge，否则就是obj1[key]里面没这个对象，需要与obj2[key]合并
		obj1[key] =
			obj1[key] && getType(obj1[key]) === 'object'
				? deepMerge(obj1[key], obj2[key])
				: (obj1[key] = obj2[key])
	}
	return obj1
}
/**
 * 改变颜色的透明度
 * @param colorStr 颜色
 * @param opacity 透明度
 * @returns
 */
export const changeColorAlpha = (colorStr: string, opacity: number) => {
	let reg = ''
	let changeMethod = ''
	switch (true) {
		case /^rgb\(/.test(colorStr):
			changeMethod = 'rgbTo'
			//如果是rgb开头，200-249，250-255，0-199
			'^[rR][gG][Bb][(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){2}[\\s]*(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)[\\s]*[)]{1}$'
			break
		case /^rgba\(/.test(colorStr):
			changeMethod = 'rgbaTo'
			//如果是rgba开头，判断0-255:200-249，250-255，0-199 判断0-1：0 1 1.0 0.0-0.9
			reg =
				'^[rR][gG][Bb][Aa][(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){3}[\\s]*(1|1.0|0|0.[0-9])[\\s]*[)]{1}$'
			break
		case /^#/.test(colorStr):
			changeMethod = 'hexTo'
			//六位或者三位
			reg = '^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$'
			break
	}
	if (colorStr.match(new RegExp(reg))) {
		return changeColorAlphaMap[changeMethod](colorStr, opacity)
	} else {
		return colorStr
	}
}

// 颜色转rgba的方法
const changeColorAlphaMap = {
	rgbTo: (colorStr: string, alp: number) => {
		const rgb = colorStr.match(/[\d.]+/g)
		if (rgb && rgb?.length >= 3) {
			return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alp})`
		}
	},
	rgbaTo: (colorStr: string, alp: number) => {
		const rgba = colorStr.match(/[\d.]+/g)
		if (rgba && rgba?.length >= 4) {
			return `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${alp})`
		}
	},
	hexTo: (hex: string, alp: number) => {
		if (hex.length === 3) {
			hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
		}
		const bigint = parseInt(hex, 16)
		return `rgba(${(bigint >> 16) & 255},${(bigint >> 8) & 255},${
			bigint & 255
		},${alp})`
	},
}
