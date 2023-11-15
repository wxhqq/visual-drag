<template>
	<div class="v-text-wrap">
		<p
			v-if="!isShowEdit"
			:style="textStyle"
			@dblclick.stop.prevent="editTxt">
			{{ nodeInfo.propData.text }}
		</p>
		<Input
			v-if="isShowEdit"
			ref="curInput"
			:class="['v-text-input', skin]"
			:autosize="false"
			type="textarea"
			:style="textStyle"
			v-focus="isShowEdit"
			v-model="nodeInfo.propData.text"
			@on-blur="isShowEdit = false"
			@on-enter="isShowEdit = false" />
	</div>
</template>

<script lang="ts">
import { ScreenComponent } from '@/store/modules/visual-screen'
import { getType } from '@utils'
import { Component, Prop, Vue, Ref } from 'vue-property-decorator'

// 组件

@Component({
	directives: {
		focus(el, { value }) {
			setTimeout(() => {
				value && el.getElementsByTagName('textarea')[0].focus()
			}, 600)
		},
	},
})
export default class Vtext extends Vue {
	@Prop() nodeInfo: ScreenComponent
	@Ref('curInput') curInput: any
	@Prop({ default: 'dark' }) skin: 'light' | 'dark' //皮肤  深浅

	isShowEdit = false

	get textStyle() {
		const styles = { ...this.nodeInfo.attrStyle }
		const { top, left, width, height, ...res } = styles

		for (const attr in res) {
			if (getType(res[attr]) == 'number' && attr !== 'lineHeight') {
				res[attr] = `${res[attr]}px`
			}
		}
		return res
	}
	editTxt() {
		this.isShowEdit = true
		this.$nextTick(() => {
			Object.assign(
				this.curInput.$el.querySelector('textarea').style,
				this.textStyle
			)
		})
	}
}
</script>

<style lang="scss" scoped>
.v-text-wrap {
	@include size(100%);
}
::v-deep .v-text-input .ivu-input {
	width: 100%;
	height: 100%;
	border: none;
	background: transparent;
	@include hide-scroll-bar();
	&:focus {
		box-shadow: none;
	}
}
</style>
