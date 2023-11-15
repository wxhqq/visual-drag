<template>
	<Modal
		width="480"
		title="过滤条件"
		:value="isShow"
		:closable="true"
		@on-cancel="closeModal"
		class-name="bolean-modal">
		<!-- <bl-form
			:formItems="formItems"
			:defaultValue="dataInfo.params"
			:rules="formValidators">
			<span slot="name">
				{{ dataInfo.name }}
			</span>
		</bl-form> -->
		待完善。。。
		<div slot="footer">
			<Button @click="closeModal">取消</Button>
			<bl-button type="primary" @click="save">保存</bl-button>
		</div>
	</Modal>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'
/**
 * 过滤条件设置
 */
@Component
export default class ComFilterSettingsModal extends Vue {
	// 用于控制弹窗显示隐藏的 value v-model 传入的
	@PropSync('value') isShow: boolean
	@Prop() dataInfo: {}

	modelInfo = {}

	// 定义表单校验规则
	formValidators = {
		test: { required: true, rule: { length: [1, 32] } },
	}
	// 表单配置项
	get formItems() {
		return [
			{ key: 'name', label: '原始名称', bltype: 'slot' },
			{ key: 'test', label: '显示名' },
		]
	}

	@Watch('isShow')
	onModalShow() {
		if (this.isShow) {
			this.modelInfo = {
				...this.dataInfo,
			}
		}
	}

	closeModal() {
		this.isShow = false
	}
	// 保存
	save() {}
}
</script>
<style lang="scss" scoped></style>
