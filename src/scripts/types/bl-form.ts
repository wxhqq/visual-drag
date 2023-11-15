// 表单配置项的类型
export type FormItemType = {
	//每项表单中的key
	key?: string
	//formItem 中的label
	label?: string
	//表单中分块的小标题（只需传title即可）
	title?: string
	//formItem 的类型
	bltype?:
		| 'input'
		| 'inputnumber'
		| 'select'
		| 'switch'
		| 'radio'
		| 'checkbox'
		| 'cascader'
		| 'time'
		| 'text'
		| 'timeText'
		| 'slot'
	//表单中需要自定义整个formItem时使用，如自定义增减formItem时，
	// custom为true时必须要传key, key 为slot 的name
	custom?: boolean
	// 是否隐藏formitem, e.g. 在过滤框展开更多中使用
	isHidden?: boolean
	// 给formitem 单独设置label-width
	labelWidth?: number
	// 是否为必填项（必填*）， 一般在下拉框中有默认值，且不允许clear时，可以设置
	required?: boolean
	// 给formitem 单独设置样式， 只会影响当前formitem
	itemClass?: string
	// formitem 占几个单元格， 如表单在两列分支时，如果让某个表单占满一行， 则可设置span：2
	span?: string | number

	// 与 Input、DatePicker 基础组件中的type一样
	type?:
		| 'text'
		| 'password'
		| 'textarea'
		| 'url'
		| 'email'
		| 'date'
		| 'number'
		| 'tel'
		| 'date'
		| 'daterange'
		| 'datetime'
		| 'datetimerange'
		| 'year'
		| 'month'
	// placeholder描述信息，不填时会根据label自动生成 《请输入XXX》
	place?: string
	// 表单禁用
	disabled?: boolean
	// 表单只读
	readonly?: boolean
	// textarea 文本域的显示行数
	rows?: number
	// 基础表单尺寸大小
	size?: 'large' | 'small' | 'default'
	// 最大输入长度
	maxlength?: number

	// 最大输入值  inputNumber类型
	max?: number
	// 最小输入值   inputNumber类型
	min?: number
	// 数值精度   inputNumber类型
	precision?: number

	// 是否为多选（select）
	multiple?: boolean
	// 是否可以清空（select、cascader 等）
	clear?: boolean
	// 是否可以搜索（select、cascader 等）
	filter?: boolean

	// 是否可以新增选项 (select) 新增新选项（通过与后端通信时、有多个输入选项时）
	addNew?: boolean
	// addnew为true时设置， 在两个下拉框关联时使用
	relatedKey?: string

	// 选项配置 （select、radio、checkbox）
	options?:
		| { label: string; value: string | number | boolean }[]
		| string[]
		| Record<string, string>
	// 选项配置 （DatePicker ）
	timeOptions?: {}

	// 是否展示 高中低 级别的图标
	showLevelIcon?: boolean

	// filter 过滤器中的参数 （一般在表单详情中使用），
	// convertMap值为constant常量的名称，一般都为大写 如 'ASSETS_VALUE'
	convertMap?: string

	onEnter?: () => {} // 回车事件

	onChange?: () => {} // 数据改变

	onSelect?: () => {} // 数据选中时
}

// 表单校验规则的类型
export type RulesType = Record<
	string,
	{
		//是否为必填
		required?: boolean
		// required 为true时，并存在rule时， 校验提示语中的出现（请输入XXX）
		label?: string
		// 自定义rule规则
		rule?: {
			//正则常量REGEXP的key值 如MAC，当有特定格式时需要和常量TIPS的key值保持一致
			reg?: string
			// 字符长度 存在一个值时（字符长度不超过XXX位）
			// 存在两个值(字符长度范围${min}~${max}位)
			length?: [number, number] | number
			// 整型类输入范围
			range?: [number, number] | number
		}
		[key: string]: any //和validate 校验保持一致
	}
>
