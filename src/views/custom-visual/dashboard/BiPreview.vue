<template>
	<div
		class="dashboard-preview"
		:class="`${themeOptions.skin} ${themeOptions.skin}-scroll-bar`">
		<div class="dashboard-editor" :style="editorStyle" id="dashboardEditor">
			<header class="editor-header flex-justify-between">
				<div class="bi-title">
					{{ themeOptions.title }}
				</div>
				<!-- 退出 -->
				<Icon
					class="ml-8px fs-24"
					custom="bl-icon-exit light-txt"
					title="退出"
					@click="$router.go(-1)" />
			</header>
			<!-- 故事线 导航 -->
			<StoryLine :allComponents="allAddedComponents" />
			<main class="bi-grid-container">
				<grid-layout
					:style="{
						'margin-left': `${-themeOptions.cardGap}px`,
						'margin-right': `${-themeOptions.cardGap}px`,
					}"
					:layout.sync="allAddedComponents"
					:col-num="12"
					:row-height="30"
					:margin="[themeOptions.cardGap, themeOptions.cardGap]"
					:isDraggable="false"
					:isResizable="false"
					:use-css-transforms="true">
					<grid-item
						v-for="item in allAddedComponents"
						:x="item.x"
						:y="item.y"
						:w="item.w"
						:h="item.h"
						:i="item.i"
						:key="item.i"
						class="bi-grid-item">
						<BiCard
							:nodeInfos="item"
							:showCardMenu="false"
							v-if="item.component">
							<component
								:is="item.component"
								:node-info="item"
								:skin="themeOptions.skin"></component>
						</BiCard>
					</grid-item>
				</grid-layout>
			</main>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import VisualDashboardStore from '@store/modules/visual-dashboard'

import BiCard from './edit/components/BiCard.vue'
import StoryLine from './edit/components/StoryLine.vue'
import { GridLayout, GridItem } from 'vue-grid-layout'
// 自动注册
import { VisualComponentList } from '../screen-edit/scripts/auto-register-component'
// import testData from './test-data'
// 组件

@Component({
	components: {
		BiCard,
		StoryLine,
		GridLayout,
		GridItem,
		...VisualComponentList,
	},
})
export default class OcBiPreview extends Vue {
	// 画布中所有添加的组件
	get allAddedComponents() {
		return VisualDashboardStore.allAddedComponents
	}
	// 页面样式配置
	get themeOptions() {
		return VisualDashboardStore.themeOptions
	}

	// 编辑页面
	get editorStyle() {
		const { backgroundColor, backgroundImg } = this.themeOptions
		return {
			backgroundColor,
			backgroundImage: backgroundImg
				? `url(${require(`@assets/custom-visual/dashboard/theme-bg-${backgroundImg}.jpg`)})`
				: '',
		}
	}

	mounted() {
		// VisualDashboardStore.updateData({
		// 	key: 'themeOptions',
		// 	data: testData.themeOptions,
		// })
		// VisualDashboardStore.updateData({
		// 	key: 'allAddedComponents',
		// 	data: testData.components,
		// })
	}
}
</script>

<style lang="scss" scoped>
.dashboard-preview {
	overflow-y: auto;
	overflow-x: hidden;
	@include set-skin() {
		color: get-bg-changed-variable('color-text-primary');
	}
}
.dashboard-editor {
	position: relative;
	min-height: 100%;
	padding: 20px 16px;
	display: flex;
	flex-direction: column;
	background: {
		repeat-x: no-repeat;
		size: 100% auto;
	}
}
.editor-header {
	// @include height-lh(28px);
	// 标题
	.bi-title {
		@include height-lh(32px);
		font-weight: bold;
		font-size: 24px;
		@include set-skin() {
			color: get-bg-changed-variable('color-text-crucial');
		}
	}
}
// 网格布局
.bi-grid-container {
	padding: 8px 0;
	flex: 1;
	position: relative;
}
</style>
