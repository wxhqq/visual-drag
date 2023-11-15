import dayjs from 'dayjs'
//  -----------------------------   时间  ------------------------------------------------
const formatMap = {
	datetime: 'YYYY-MM-DD HH:mm:ss',
	date: 'YYYY-MM-DD',
	time: 'HH:mm:ss',
}
/**
 * @desc 格式化 带时区的 ISO
 *      时间格式为 datetime(yyyy-MM-dd HH:mm:ss) , date(yyyy-MM-dd) ,time(HH:mm:ss)形式
 * @param {String|Data} isoTimeStr iso 格式的时间字符串，中国时区
 * @param {String} format 转换类型，datetime、date、time,datetime default
 * @example
 *  isoTime = '2018-08-22T21:16:01.752076+08:00'
 *
 *  formatLocalISOTime(isoTime)  // 2018-08-22 21:16:01
 *  formatLocalISOTime(isoTime, date)  // 2018-08-22
 *  formatLocalISOTime(isoTime, time)  // 21:16:01
 */
export const formatLocalISOTime = (
	isoTimeStr: Date | string,
	format = 'datetime'
) => {
	if (String(new Date(isoTimeStr)) === 'Invalid Date') {
		return ''
	}

	// 如果不存在时间参数
	if (isoTimeStr) {
		const time = new Date(isoTimeStr)
		return dayjs(time).format(formatMap[format])
	} else {
		return '-'
	}
}

// 时间筛选快捷键默认配置 最近1小时，最近12小时，最近1天，最近7天，最近30天
// 统一选择时间范围为到当前时间：未来时间不可选
//自定义最大选择时间范围为最近180天内
export const defaultDateRangeOptions = {
	// 快捷选择时间
	shortcuts: [
		{
			text: '最近1小时',
			value() {
				return [
					dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
					dayjs().format('YYYY-MM-DD HH:mm:ss'),
				]
			},
		},
		{
			text: '最近12小时',
			value() {
				return [
					dayjs().subtract(12, 'hour').format('YYYY-MM-DD HH:mm:ss'),
					dayjs().format('YYYY-MM-DD HH:mm:ss'),
				]
			},
		},
		{
			text: '最近24小时',
			value() {
				return [
					dayjs().subtract(24, 'hour').format('YYYY-MM-DD HH:mm:ss'),
					dayjs().format('YYYY-MM-DD HH:mm:ss'),
				]
			},
		},
		{
			text: '最近7天',
			value() {
				return [
					dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
					dayjs().format('YYYY-MM-DD HH:mm:ss'),
				]
			},
		},
		{
			text: '最近30天',
			value() {
				return [
					dayjs().subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss'),
					dayjs().format('YYYY-MM-DD HH:mm:ss'),
				]
			},
		},
		{
			text: '最近180天',
			value() {
				return [
					dayjs().subtract(180, 'day').format('YYYY-MM-DD HH:mm:ss'),
					dayjs().format('YYYY-MM-DD HH:mm:ss'),
				]
			},
		},
	],
	disabledDate(date: number) {
		// 筛选时间过去的180天
		return (
			date &&
			(date.valueOf() > Date.now() ||
				date.valueOf() < dayjs().subtract(180, 'day').valueOf())
		)
	},
}
