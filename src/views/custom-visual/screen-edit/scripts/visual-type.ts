// 字段类型
export type FieldType =
	| 'string' //字符串
	| 'number' //数值
	| 'datetime' //日期 完整
	| 'year' //年
	| 'year-month' //月
	| 'year-month-day' //日
	| 'hour' //时
	| 'hour-minute' //分
	| 'hour-minute-second' //秒

// 聚合方式
export type AggregateType =
	| 'none'
	| 'sum'
	| 'average'
	| 'count'
	| 'dedup-count'
	| 'max'
	| 'min'

// 排序方式
export type SortType = 'none' | 'desc' | 'asc'

// 原始的数据面板 维度和度量的数据类型
export type DataFieldType = {
	name: string
	field: string
	fieldType: FieldType //字段类型
	category: 'dimension' | 'measure'
	chrildren?: DataFieldType[]
}

// 组件配置后的字段类型
export type ComponentMetricType = {
	name: string
	field: string
	fieldType: FieldType //字段类型
	category: 'dimension' | 'measure'
	sort: SortType
	aggregate?: AggregateType
}
