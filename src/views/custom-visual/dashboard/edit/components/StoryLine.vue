<template>
	<!-- 故事线 导航 -->
	<div class="conten-menu-wrap mt-16px" :style="menuWrapStyle">
		<div class="left-btn arraw-btn" @click="moveMenuBar('left')">
			<i class="bl-icon-before-page"></i>
		</div>
		<ul class="content-menu story-menu-bar">
			<li
				v-for="(item, index) in allComponents"
				:key="index"
				class="ellipsis-1"
				:id="`story-menu-${index + 1}`"
				:title="item.label"
				:class="{ actived: activeComponent.guid === item.guid }"
				@click="onActiveBiCard(item)">
				<span class="mr-4px">{{ index + 1 }}</span>
				<span>{{ item.label }}</span>
			</li>
		</ul>
		<div class="right-btn arraw-btn" @click="moveMenuBar('right')">
			<i class="bl-icon-next-page"></i>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import VisualDashboardStore, {
	BiComponent,
} from '@store/modules/visual-dashboard'
// 故事线组件

@Component
export default class OcBiStoryLine extends Vue {
	@Prop() allComponents: BiComponent[]

	// 被激活组件
	get activeComponent() {
		return VisualDashboardStore.activeComponent
	}

	// 栅格容器样式
	get menuWrapStyle() {
		const { skin } = VisualDashboardStore.themeOptions
		return {
			backgroundColor:
				skin === 'dark'
					? 'rgba(31, 31, 31, 0.7)'
					: 'rgba(255,255, 255,0.8)',
		}
	}
	// 选中卡片并定位
	onActiveBiCard(item: BiComponent) {
		// 激活选中当前组件
		VisualDashboardStore.updateData({
			key: 'activeComponent',
			data: item,
		})
		// 滚动到可视区域
		const cardDom = document.getElementById(item.guid)
		if (cardDom) {
			cardDom.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			})
		}
	}

	// 滑动故事线
	moveMenuBar(orientation: string) {
		const menuBar = document.querySelector('.story-menu-bar')
		if (!menuBar) return
		let scrollLeft = menuBar.scrollLeft
		if (orientation === 'left') {
			scrollLeft -= 128
		} else {
			scrollLeft += 128
		}
		menuBar.scrollTo({ left: scrollLeft, behavior: 'smooth' })
	}
}
</script>

<style lang="scss" scoped>
// 故事线
.conten-menu-wrap {
	position: sticky;
	top: 0;
	z-index: 100;
	@include flex-justify-align(space-between);
	backdrop-filter: blur(5px);
	border-radius: 4px;
	height: 48px;
	box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
	.arraw-btn {
		height: 100%;
		width: 48px;
		cursor: pointer;
		z-index: 2;
		text-align: center;
		line-height: 48px;
	}
	.left-btn {
		box-shadow: 10px 0 8px 0 rgba(0, 0, 0, 0.05);
	}
	.right-btn {
		box-shadow: -10px 0 8px 0 rgba(0, 0, 0, 0.05);
	}
	.content-menu {
		@include flex-justify-align();
		overflow: hidden;
		li {
			height: 32px;
			line-height: 32px;
			width: 120px;
			padding: 0 16px;
			border-radius: 4px;
			flex-shrink: 0;
			cursor: pointer;
			text-align: center;
			transition: all 0.3s;
			margin: 0 4px;
			&:hover {
				@include set-skin() {
					background-color: get-bg-changed-variable('color-body-bg');
				}
			}
		}
		.actived {
			@include set-theme {
				background-color: get-themed-variable(
					'color-theme-secondary'
				) !important;
			}
			color: $color-white-100;
		}
	}
}
</style>
