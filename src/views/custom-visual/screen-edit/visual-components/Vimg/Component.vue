<template>
	<div class="v-img-wrap" :style="imgStyle">
		<div class="no-data" v-if="!nodeInfo.attrStyle.url">
			<Icon type="md-images" size="48" />
			<span>请在属性区设置图片</span>
		</div>
	</div>
</template>

<script lang="ts">
import { BiComponent } from '@/store/modules/visual-dashboard'
import { ScreenComponent } from '@/store/modules/visual-screen'
import { Component, Prop, Vue } from 'vue-property-decorator'

// 组件

@Component
export default class Vimg extends Vue {
	@Prop({ default: 'dark' }) skin: 'light' | 'dark' //皮肤  深浅
	@Prop() nodeInfo: ScreenComponent | BiComponent

	get imgStyle() {
		const { url, displayType } = this.nodeInfo.attrStyle
		const res = {}
		if (url) {
			res['background-image'] = `url(${url})`
		}
		switch (true) {
			case displayType === 'fit':
				res['background-position'] = 'center'
				res['background-size'] = '100%'
				break
			case displayType === 'flat':
				res['background-repeat'] = 'repeat'
				break
			case displayType === 'center':
				res['background-position'] = 'center'
				break
			case displayType === 'cover':
				res['background-position'] = 'center'
				res['background-size'] = 'cover'
				break
			case displayType === 'full':
				res['background-size'] = '100% 100%'
				break
		}
		return res
	}
}
</script>

<style lang="scss" scoped>
.v-img-wrap {
	@include size(100%);
	background-repeat: no-repeat;
}
.no-data {
	@include size(100%);
	@include flex-dir-justify-align(column, center, center);
	@include set-skin {
		color: get-bg-changed-variable('color-text-regular');
	}
}
</style>
