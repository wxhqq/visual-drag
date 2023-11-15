<template>
	<div class="lottie-container" ref="blLottie" :style="lottieStyle">
		<div class="lottie-content">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'

import lottie from 'lottie-web'

@Component
export default class BlLottie extends Vue {
	@Prop({ default: () => ({}) }) options: {
		loop: boolean
		autoplay: boolean
		animationData: any
		rendererSettings: any
	}
	@Prop({ default: 0 }) width: string | number
	@Prop({ default: 0 }) height: string | number

	@Ref('blLottie') blLottie: HTMLElement

	anim = {}

	get lottieStyle() {
		const res = {}
		this.width && (res['width'] = this.width)
		this.height && (res['height'] = this.height)
		return res
	}

	mounted() {
		this.anim = lottie.loadAnimation({
			container: this.blLottie,
			renderer: 'svg',
			loop: this.options.loop !== false, // 是否循环播放动画
			autoplay: this.options.autoplay !== false, // 是否自动播放动画
			// 动画数据
			animationData: this.options.animationData.default
				? this.options.animationData.default
				: this.options.animationData,
			rendererSettings: this.options.rendererSettings,
		})
		this.$emit('anim-created', this.anim)
	}
}
</script>

<style lang="scss" scoped>
.lottie-container {
	position: relative;

	svg,
	.lottie-content {
		position: absolute;
		top: 0;
		left: 0;
	}

	svg {
		z-index: 0;
	}

	.lottie-content {
		width: 100%;
		height: 100%;
		z-index: 1;
	}
}
</style>
