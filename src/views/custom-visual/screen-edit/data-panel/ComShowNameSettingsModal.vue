<template>
	<Modal
		width="480"
		title="显示名设置"
		:value="isShow"
		:closable="true"
		@on-cancel="closeModal"
		class-name="bolean-modal has-form">
		<bl-form :formItems="formItems" :defaultValue="modelInfo"></bl-form>
		<div slot="footer">
			<Button @click="closeModal">取消</Button>
			<bl-button type="primary" @click="save">保存</bl-button>
		</div>
	</Modal>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'
/**
 * 显示名设置
 */
@Component
export default class ComShowNameSettingsModal extends Vue {
	// 用于控制弹窗显示隐藏的 value v-model 传入的
	@PropSync('value') isShow: boolean
	@Prop() dataInfo: {}

	modelInfo = {}

	@Watch('isShow')
	onModalShow() {
		if (this.isShow) {
			this.modelInfo = {
				name: this.dataInfo['name'],
				// showName: this.dataInfo['params']['showName'],
			}
		}
	}

	// 表单配置项
	get formItems() {
		return [
			{ key: 'name', label: '原始名称', bltype: 'text' },
			{ key: 'showName', label: '显示名', maxlength: 32 },
		]
	}

	closeModal() {
		this.isShow = false
	}

	save() {
		if (!this.modelInfo['showName']) {
			this.modelInfo['showName'] = this.modelInfo['name']
		}
		// this.dataInfo['params']['showName'] = this.modelInfo['showName']
		this.isShow = false
	}
}
</script>
<style lang="scss" scoped>
::v-deep.show-name-wrap {
	color: $color-white-65;
	padding: 10px;
	.title {
		color: $color-white-85;
	}
	footer {
		@include flex-justify(flex-end);
	}
}
</style>
