<template>
	<Button
		:type="type"
		:custom-icon="customIcon"
		:loading="newLoading"
		@click="handleClick">
		<slot></slot>
	</Button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
/**
 * 给Button增加一层默认的loading处理，
 * 一般在Modal中确认时使用， 避免重复调接口报错
 */
@Component
export default class BlButton extends Vue {
	// 类型，直接匹配 icon
	@Prop({ default: 'default' }) type: string
	// loading时间
	@Prop({ default: 400 }) loadTime: number
	// 是否启用默认loading
	@Prop({ default: true }) autoLoading: boolean
	//Button自身loading控制
	@Prop({ default: false }) loading: boolean
	// 自定义图标
	@Prop({ default: '' }) customIcon: string
	newLoading = false

	handleClick<T>(val: T) {
		this.$emit('click', val)
		if (this.type !== 'text' && this.autoLoading) {
			this.newLoading = true
			setTimeout(() => {
				this.newLoading = false
			}, this.loadTime)
		} else {
			this.newLoading = this.loading
		}
	}
}
</script>
