<template>
	<Form
		ref="form"
		:model="defaultValue"
		:label-width="labelWidth"
		:label-position="labelPosition"
		:rules="formRules"
		@submit.native.prevent
		:label-colon="labelColon ? '：' : labelColon"
		:class="['bl-form', isText ? 'text' : '']"
		:style="{
			'grid-template-columns': `repeat(${cols || 1}, 1fr)`,
			gap: gap || 0,
		}">
		<div
			v-for="({ key, ...item }, index) in formItems"
			:key="key || index"
			class="bl-form-item"
			:style="{
				'grid-column-start': `span ${
					item.span || (item.title ? cols : 1)
				}`,
			}"
			v-show="!item.isHidden">
			<!-- 小标题 -->
			<template v-if="item.title">
				<div :class="['bolean-title mt-16px', item.titleClass]">
					{{ item.title }}
				</div>
			</template>
			<!-- 自定义formItem -->
			<template v-else-if="item.custom">
				<slot :name="key"></slot>
			</template>
			<FormItem
				:key="`${key}-${index}`"
				v-else-if="!item.isHidden"
				:prop="key"
				:label="item.label"
				:label-width="item.labelWidth || labelWidth"
				:required="item.required"
				:class="[itemClass, item.itemClass]">
				<!-- label提示 -->
				<span v-if="item.labelTip" slot="label" class="label-with-tips">
					<span>{{ item.label }}</span>
					<Poptip transfer trigger="hover" placement="bottom">
						<div style="white-space: pre" slot="content">
							{{ item.labelTip }}
						</div>
						<i class="icon-btn bl-icon-notice-fill" />
					</Poptip>
				</span>
				<Input
					v-if="item.bltype === 'input' || !item.bltype"
					v-model.trim="defaultValue[key]"
					:type="item.type || 'text'"
					clearable
					:placeholder="item.place || '请输入'"
					:disabled="item.disabled"
					:readonly="item.readonly"
					:show-word-limit="
						item.type == 'textarea' && !item.hideWordLimit
					"
					:rows="item.rows || 3"
					:size="item.size || itemSize"
					:maxlength="item.maxlength || 100"
					@on-enter="handlerMethod($event, item.onEnter)"
					@on-change="onInputChange(key, item)"
					@on-blur="handlerMethod($event, item.onBlur)"
					@on-focus="handlerMethod($event, item.onFocus)"
					@on-clear="handlerMethod($event, item.onClear)">
					<span slot="prepend" v-if="item.prepend">
						{{ item.prepend }}
					</span>
					<span slot="append" v-if="item.append">
						{{ item.append }}
					</span>
				</Input>
				<InputNumber
					v-else-if="item.bltype === 'inputnumber'"
					v-model="defaultValue[key]"
					:max="item.max"
					:min="item.min"
					:step="item.step || 1"
					:precision="item.precision || 0"
					:size="item.size || itemSize"
					:active-change="false"
					:disabled="item.disabled"
					@on-change="handlerMethod($event, item.onChange)"
					@on-focus="handlerMethod($event, item.onFocus)"
					:placeholder="item.place || '请输入'" />
				<Select
					v-else-if="item.bltype === 'select'"
					v-model="defaultValue[key]"
					:multiple="item.multiple"
					:disabled="item.disabled"
					:clearable="item.clear"
					:filterable="item.filter"
					:size="item.size || itemSize"
					:transfer="'transfer' in item ? item.transfer : true"
					:transfer-class-name="item.transferClass"
					@on-change="handlerMethod($event, item.onChange)"
					@on-select="handlerMethod($event, item.onSelect)"
					@on-clear="handlerMethod($event, item.onSelect)"
					:placeholder="item.place || '请选择'">
					<Option
						v-for="(option, key) in item.options"
						:value="
							option.value || option.value == 0
								? option.value
								: option
						"
						:key="key"
						:label="option.label || option">
						{{ option.label || option.value || option }}
					</Option>
				</Select>
				<i-switch
					v-else-if="item.bltype === 'switch'"
					v-model="defaultValue[key]"
					:disabled="item.disabled"
					:size="item.size || itemSize"
					@on-change="handlerMethod($event, item.onChange)" />
				<RadioGroup
					v-else-if="item.bltype === 'radio'"
					v-model="defaultValue[key]"
					:disabled="item.disabled"
					:size="item.size || itemSize"
					:type="item.type || undefined"
					@on-change="handlerMethod($event, item.onChange)">
					<Radio
						v-for="(radio, key) in item.options"
						:key="key"
						:disabled="item.disabled || radio.disabled"
						:label="
							radio.value || radio.value == 0
								? radio.value
								: radio
						">
						{{ radio.label || radio }}
					</Radio>
				</RadioGroup>
				<CheckboxGroup
					v-else-if="item.bltype === 'checkbox'"
					v-model="defaultValue[key]"
					:disabled="item.disabled"
					:size="item.size || itemSize"
					@on-change="handlerMethod($event, item.onChange)">
					<Checkbox
						v-for="(check, key) in item.options"
						:key="key"
						:label="
							check.value || check.value == 0
								? check.value
								: check
						">
						{{ check.label || check }}
					</Checkbox>
				</CheckboxGroup>
				<Checkbox
					v-else-if="item.bltype === 'single-checkbox'"
					v-model="defaultValue[key]"
					:disabled="item.disabled"
					:size="item.size || itemSize"></Checkbox>
				<Cascader
					v-else-if="item.bltype === 'cascader'"
					v-model="defaultValue[key]"
					:data="item.data"
					transfer
					:disabled="item.disabled"
					:clearable="item.clear"
					:filterable="item.filter"
					change-on-select
					:size="item.size || itemSize"
					@on-change="onCascaderChange($event, item.onChange)" />
				<DatePicker
					v-else-if="item.bltype === 'time'"
					v-model.trim="defaultValue[key]"
					transfer
					:editable="false"
					:options="
						item.timeOptions ||
						(!item.type ? defaultDateRangeOptions : {})
					"
					:transfer-class-name="
						!item.type || item.type.includes('range')
							? 'bolean-date-range-shortcuts'
							: ''
					"
					:type="item.type || 'datetimerange'"
					:format="item.format || 'yyyy-MM-dd HH:mm:ss'"
					:placeholder="item.place || '请选择'"
					:size="item.size || itemSize"
					@on-change="
						onDatePickerChange($event, item.onChange, key)
					" />
				<ColorPicker
					v-else-if="item.bltype === 'color'"
					v-model.trim="defaultValue[key]"
					transfer
					:alpha="true"
					:size="item.size || itemSize"
					:transfer-class-name="item.transferClass"
					:disabled="item.disabled"
					@on-change="handlerMethod($event, item.onChange)" />
				<p
					v-else-if="item.bltype === 'text'"
					:title="item.ellipsis ? defaultValue[key] : ''">
					<!-- filter 转换 -->
					<span v-if="item.convertMap">
						{{
							defaultValue[key] ||
							'-' | convertFiled(item.convertMap)
						}}
					</span>
					<span
						v-else
						class="text-show"
						:class="
							item.ellipsis ? `ellipsis-${item.ellipsis}` : ''
						">
						{{
							defaultValue[key] || defaultValue[key] === 0
								? defaultValue[key]
								: '-'
						}}
					</span>
				</p>
				<span v-else-if="item.bltype === 'timeText'">
					{{ defaultValue[key] | formatLocalISOTime }}
				</span>

				<!-- 自定义 -->
				<template v-else-if="item.bltype === 'slot'">
					<slot :name="key"></slot>
				</template>
				<!-- AutoComplete，可替换需要 created 的 Select -->
				<AutoComplete
					v-else-if="item.bltype === 'autocomplete'"
					v-model="defaultValue[key]"
					:disabled="item.disabled"
					:data="item.data"
					@on-change="
						handlerMethod($event, item.onChange, item.methodCustom)
					"
					@on-blur="handlerMethod(item.onBlur)"
					@on-select="
						handlerMethod($event, item.onSelect, item.methodCustom)
					"
					:clearable="item.clear"
					:placeholder="item.place"
					transfer
					transfer-class-name="autocomplete-height"
					@keyup.native.enter.prevent="
						() => {
							handlerMethod(
								defaultValue[key],
								item.onEnter || item.onSelect,
								item.methodCustom
							)
						}
					"
					:filter-method="item.onFilter"></AutoComplete>
			</FormItem>
		</div>
	</Form>
</template>

<script lang="ts">
import { Component, Mixins, Watch, Prop, Ref } from 'vue-property-decorator'
import validateMixin from '@/scripts/mixins/handle-validator'
import { debounce, defaultDateRangeOptions } from '@utils'
import { FormItemType, RulesType } from '@scripts/types/bl-form'

@Component
export default class BlForm extends Mixins(validateMixin) {
	// 表单项
	@Prop({ default: () => [] }) formItems: FormItemType[]
	// 校验规则
	@Prop({ default: () => {} }) rules: RulesType

	// label-width
	@Prop({ default: 82 }) labelWidth: number
	// label-width
	@Prop({ default: 'right' }) labelPosition: string

	// 表单数据
	@Prop({ default: () => {} }) defaultValue: Record<string, any>
	// 是否加冒号
	@Prop({ default: true }) labelColon: boolean
	// 表单展示列数
	@Prop({ default: 1 }) cols: string | number
	// 是否显示加载框
	@Prop({ default: false }) loading: boolean
	// 是否是详情 文本展示
	@Prop({ default: false }) isText: boolean
	// 用于存在多个表单时
	@Prop({ default: '' }) formIndex: string | number
	// 表单item的样式 统一的 修改边距等
	@Prop({ default: '' }) itemClass: string
	// 表单项间距
	@Prop({ default: '0' }) gap: string
	// 表单尺寸大小
	@Prop({ default: 'default' }) itemSize: string

	@Ref('form') blformRef: any

	defaultDateRangeOptions = defaultDateRangeOptions

	formRules: RulesType = {}
	isSpinShow = true

	// 校验规则处理
	@Watch('rules', { immediate: true })
	onChangedRules(val: RulesType) {
		val && this.setFormRules(val)
	}

	setFormRules(val: RulesType) {
		const ruleMap = {}
		for (const key in val) {
			const itemRule = val[key]
			if (Array.isArray(itemRule)) {
				ruleMap[key] = [...itemRule]
			} else {
				const curItemForm = this.formItems.find(
					item => item.key === key
				)
				ruleMap[key] = {
					trigger: 'change,blur',
					label: curItemForm?.label || ruleMap[key]?.label,
					...itemRule,
				}
				// 校验方法
				if (itemRule.validator) {
					ruleMap[key].validator = itemRule.validator
				} else if (itemRule.rule) {
					ruleMap[key].validator = this.validateForm
				}
			}
		}
		this.formRules = ruleMap
	}
	// 回调方法包装器
	handlerMethod<T>(
		val: T,
		callback: (arg0: T) => void,
		methodCustom = false
	) {
		if (callback && typeof callback === 'function') {
			if (methodCustom) {
				// 自定义change函数
				this.$emit('formSelectChange', val, this.formIndex, callback)
			} else {
				callback(val)
			}
		}
	}
	// input 的onchange事件
	onInputChange(
		key: string,
		item: { onChange: () => {}; isDebounce?: true | undefined }
	) {
		//   默认防抖
		const { onChange: callback, isDebounce = true } = item
		const val = this.defaultValue[key]

		if (isDebounce && callback && typeof callback === 'function') {
			// 空格数据校验
			this.$nextTick(() => {
				if (val === '' || val?.trim()) {
					this.debounceChange(val, callback)
				}
			})
			return
		}
		this.handlerMethod('', callback)
	}
	//  事件防抖 默认600ms
	debounceChange = debounce(
		(val: unknown, callback: (arg0: unknown) => void) => {
			callback(val)
		},
		600
	)

	// 级联下拉框监听变化
	onCascaderChange<T>(val: T, callback: (arg0: T) => void) {
		this.$nextTick(() => {
			if (callback && typeof callback === 'function') {
				callback(val)
			}
		})
	}
	// 时间选择器回调方法包装器
	onDatePickerChange<T>(
		val: T,
		callback: (arg0: T) => void,
		key: string | number
	) {
		if (Array.isArray(val)) {
			const [start, end] = val
			this.defaultValue[key] = [start, end] //修改时间格式为 字符串
		} else {
			this.defaultValue[key] = val
		}
		if (callback && typeof callback === 'function') {
			callback(val)
		}
	}
	// 校验
	validate<T>(callback: T) {
		if (callback instanceof Function) {
			this.blformRef.validate(callback)
		} else {
			let valid = true
			this.blformRef.validate((val: boolean) => {
				valid = val
			})
			return valid
		}
	}
	// 单条校验
	validateField<T>(prop: string, callback: T) {
		this.blformRef.validateField(prop, callback)
	}
	// 表单清除
	resetFields() {
		this.blformRef.resetFields()
	}
}
</script>

<style lang="scss" scoped>
.bl-form {
	flex: 1;
	display: grid;
	overflow: hidden;
	&-item {
		max-width: 100%;
		overflow: hidden;
	}
}
.text-show {
	display: inline-block;
	max-width: 100%;
}
// 带提示的label
.label-with-tips {
	display: inline-flex;
	i {
		margin-top: -10px;
	}
}
</style>
