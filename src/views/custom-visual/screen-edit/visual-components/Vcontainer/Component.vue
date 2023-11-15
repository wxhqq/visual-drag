<template>
	<div class="v-container-wrap">
		<div class="title" :class="nodeInfo.attrStyle.align">
			{{ nodeInfo.attrStyle.text }}
		</div>
	</div>
</template>

<script lang="ts">
import { ScreenComponent } from '@/store/modules/visual-screen'
import { Component, Prop, Vue } from 'vue-property-decorator'

// 组件

@Component
export default class Vcontainer extends Vue {
	@Prop({ default: 'dark' }) skin: 'light' | 'dark' //皮肤  深浅
	@Prop() nodeInfo: ScreenComponent
}
</script>

<style lang="scss" scoped>
.v-container-wrap {
	@include size(100%);
	background: linear-gradient(
		180deg,
		$transparent 0%,
		rgba(6, 96, 181, 0.5) 100%
	); // 防止过渡动画出现时透出白色
}
.title {
	color: #e5f2ff;
	font-size: 18px;
	font-weight: bold;
	height: 36px;
	line-height: 36px;
	background-size: 100% 100%;
	background-repeat: no-repeat;
	&.left {
		padding-left: 30px;
		background-image: url('~@assets/custom-visual/screen-edit/container/title-bg-l.webp');
	}
	&.right {
		padding-right: 30px;
		text-align: right;
		background-image: url('~@assets/custom-visual/screen-edit/container/title-bg-r.webp');
	}
	&.center {
		text-align: center;
		background-image: url('~@assets/custom-visual/screen-edit/container/title-bg-c.webp');
	}
}
</style>
