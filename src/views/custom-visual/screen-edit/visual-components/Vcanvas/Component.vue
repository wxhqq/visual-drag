<template>
	<div class="home-wrap hide-scroll-bar dark">
		<!-- 头部 -->
		<BlLottie
			class="anim-comm anim-header"
			:options="getAnimOptions('top')">
			<div class="header-content light-txt">
				<span class="left">logo</span>
				<span class="title">智慧管理大屏</span>
				<div class="right">
					<span class="time mr-24px">{{ systemTime }}</span>
					<!-- 退出 -->
					<Icon
						custom="bl-icon-exit light-txt"
						title="退出"
						@click="exit" />
				</div>
			</div>
		</BlLottie>
		<!-- 尾部 -->
		<BlLottie
			class="anim-comm anim-footer"
			:options="getAnimOptions('bottom')"></BlLottie>
	</div>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class Vcanvas extends Vue {
	systemTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
	// 获取动画配置
	getAnimOptions(file: string) {
		return {
			animationData: require(`@assets/custom-visual/screen-edit/canvas/template1/${file}.json`),
		}
	}

	exit() {
		this.$router.go(-1)
	}
}
</script>

<style lang="scss" scoped>
// 动画样式
.anim-comm {
	position: absolute;
	z-index: 2;
}
.light-txt {
	color: #e5f2ff;
	text-shadow: 0px 0px 12px #96cce8;
}
.anim-header {
	z-index: 3;
	.header-content {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;
	}
	.title {
		align-self: center;
		font-size: 44px;
		margin-top: 24px;
		font-family: YouSheBiaoTiHei;
		text-align: center;
	}
	.right {
		justify-self: right;
		.time {
			font-family: YouSheBiaoTiHei;
			font-size: 24px;
		}
		.icon-btn {
			margin-left: 16px;
		}
		i {
			font-size: 24px;
		}
	}
}
.anim-footer {
	bottom: 0;
	z-index: 3;
}
</style>
