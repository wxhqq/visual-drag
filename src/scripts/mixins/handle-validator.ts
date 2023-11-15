import { Component, Vue } from 'vue-property-decorator'
import { TIPS, REGEXP } from '@/constants'
export type RuleMap = {
	required?: boolean
	label?: string
	rule?: {
		reg?: string //正则
		length?: number[] | number //字符长度
		range?: number[] | number //整数范围
		message?: string //必填时 提示语
	}
	[x: string]: any
}
@Component
export default class ValidateMixin extends Vue {
	formValidators: Record<string, RuleMap> = {}
	created() {
		// 当不使用Blform 独立引用该文件mixin时，
		// form的rule变量取名为formValidators，
		// formatFormValidators该方法自动添加validator方法
		this.formatFormValidators()
	}
	// 表单校验
	validateForm(
		rules: RuleMap,
		value: string,
		callback?: (arg?: string) => {}
	) {
		const { required, rule } = rules
		let tips = ''
		value = value ? String(value).trim() : ''
		// 必填校验
		if (required && value === '') {
			tips = rule?.message || '请输入'
		}
		// 有内容输入时校验
		if (value !== '' && rule) {
			// 自定义rule 校验
			const { reg, length, range } = rule

			// 自定义 正则
			if (!tips && reg) {
				// 正则间存在与关系
				if (reg.includes('&')) {
					const regArr = reg.split('&')
					// 只要有一个正则不通过， 则提示错误信息
					const isFaild = regArr.some(r => !REGEXP[r]?.test(value))
					tips = isFaild ? '输入格式错误' : ''
				} else if (reg.includes('|')) {
					const regArr = reg.split('|')
					// 正则间存在或关系, 如果所有正则都不通过，则提示错误
					const isFaild = regArr.every(r => !REGEXP[r]?.test(value))
					tips = isFaild ? '输入格式错误' : ''
				} else if (!REGEXP[reg]?.test(value)) {
					tips = TIPS[reg] || '输入格式错误'
				}
			}

			// 字符长度校验
			if (!tips && length) {
				if (Array.isArray(length)) {
					// 数组
					const [min, max] = length
					if (value.length < min || value.length > max) {
						tips = `字符长度范围${min}~${max}位`
					}
				} else {
					// 数值
					if (value.length > +length) {
						tips = `字符长度不超过${length}位`
					}
				}
			}

			// 整数范围校验
			if (!tips && range && Array.isArray(range)) {
				const [min, max] = range
				const numValue = +value
				if (
					isNaN(numValue) ||
					!Number.isInteger(numValue) ||
					numValue < min ||
					numValue > max
				) {
					tips = `格式 ${min}-${max}间的整数`
				}
			}
		}

		if (callback) {
			tips ? callback(tips) : callback()
		} else {
			return tips
		}
	}
	/**
	 * 格式化表单校验， validator
	 * 单独在表单中引用该文件， 不结合blform使用时， 如果不给没项rule 不加validator,可在初始化时调用此方法
	 * formValidators:校验规则
	 */
	formatFormValidators() {
		if (!Object.keys(this.formValidators).length) {
			return
		}
		for (const key in this.formValidators) {
			if (
				this.formValidators[key]?.rule &&
				!this.formValidators[key].validator
			) {
				this.formValidators[key].validator = this.validateForm
			}
		}
	}
}
