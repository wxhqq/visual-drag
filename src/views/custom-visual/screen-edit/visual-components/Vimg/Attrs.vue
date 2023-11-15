<template>
	<bl-form
		class="attr-form-wrap"
		:formItems="formItems"
		:defaultValue="attrStyle"
		:label-width="70"
		itemSize="small"
		:labelColon="false"
		labelPosition="left"
		itemClass="mb-1">
		<div slot="url" style="line-height: 1">
			<Upload
				action=""
				:format="['png', 'jpg', 'webp', 'gif']"
				accept=".png,.jpg,.webp,.gif"
				:max-size="maxSize"
				:before-upload="handleBeforeUpload">
				<Button icon="ios-cloud-upload-outline" size="small">
					{{ attrStyle.url ? '重新上传' : '上传图片' }}
				</Button>
			</Upload>
			<span class="info-tip">支持jpg,png,webp,gif格式，最大10MB</span>
		</div>
	</bl-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

// 组件属性

@Component
export default class VimgAttrs extends Vue {
	@Prop() attrStyle: {}

	maxSize = 10 * 1024

	get formItems() {
		return [
			{
				key: 'url',
				label: '上传图片',
				bltype: 'slot',
			},
			{
				key: 'displayType',
				label: '显示方式',
				bltype: 'radio',
				options: [
					{ label: '适配区域', value: 'fit' },
					{ label: '居左平铺', value: 'flat' },
					{ label: '居中显示', value: 'center' },
					{ label: '充满区域(裁剪)', value: 'cover' },
					{ label: '充满区域(拉伸)', value: 'full' },
				],
			},
		]
	}
	handleBeforeUpload(file: File) {
		if (file.size > this.maxSize * 1024) {
			this.$Message.warning('图片大小超过限制')
			return false
		}
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = e => {
			this.attrStyle['url'] = e.target?.result
		}
	}
}
</script>

<style lang="scss" scoped>
.info-tip {
	color: $color-white-45;
}
</style>
