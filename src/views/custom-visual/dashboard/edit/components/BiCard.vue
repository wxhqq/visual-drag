<template>
	<div
		class="bi-card"
		:style="cardStyle"
		:id="nodeInfos.guid"
		:class="{ actived: activeComponent.guid === nodeInfos.guid }">
		<!-- 有标题 -->
		<div
			v-if="nodeInfos.wrapStyle"
			class="bi-card-inner-wrap"
			@click="onActiveBiCard">
			<header
				class="bl-card-header mb-1 fs-16 font-bold ellipsis-1"
				v-if="nodeInfos.wrapStyle.showTitle">
				<Input
					ref="curInput"
					size="small"
					:maxlength="32"
					v-show="isShowEdit"
					v-model="nodeInfos.label"
					@on-blur="isShowEdit = false"
					@on-enter="isShowEdit = false" />
				<p
					v-show="!isShowEdit"
					@dblclick.stop.prevent="editLabel"
					:title="nodeInfos.label"
					class="ellipsis-1 label-show">
					{{ nodeInfos.label }}
				</p>
			</header>
			<div class="bi-conponent-wrap" :style="componentWrapStyle">
				<slot></slot>
			</div>
		</div>
		<!-- 无标题 -->
		<div v-else style="height: 100%" @click="onActiveBiCard">
			<slot></slot>
		</div>
		<CardMenu :nodeInfos="nodeInfos" v-if="showCardMenu" />
	</div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
import CardMenu from './CardMenu.vue'

import VisualDashboardStore, {
	BiComponent,
} from '@store/modules/visual-dashboard'
// 组件

@Component({
	components: { CardMenu },
})
export default class OcBiCard extends Vue {
	@Prop() nodeInfos: BiComponent
	@Prop({ default: true }) showCardMenu: boolean

	@Ref('curInput') curInput: any

	isShowEdit = false
	// 页面样式配置
	get themeOptions() {
		return VisualDashboardStore.themeOptions
	}

	get activeComponent() {
		return VisualDashboardStore.activeComponent
	}

	// 卡片样式
	get cardStyle() {
		return {
			'border-radius': `${this.themeOptions.cardRadius}px`,
			'background-color':
				this.nodeInfos?.wrapStyle?.cardBgColor ||
				(this.themeOptions.skin === 'dark' ? '#1f1f1f' : '#fff'),
		}
	}

	get componentWrapStyle() {
		const wrapStyle = this.nodeInfos.wrapStyle
		return {
			height: wrapStyle?.showTitle ? 'calc(100% - 38px)' : '100%',
		}
	}

	// 编辑名称
	editLabel() {
		if (!this.showCardMenu) return
		this.isShowEdit = true
		this.$nextTick(() => {
			this.curInput.focus({
				cursor: 'end',
			})
		})
	}

	// 激活
	onActiveBiCard() {
		// 激活选中当前组件
		VisualDashboardStore.updateData({
			key: 'activeComponent',
			data: this.nodeInfos,
		})
	}
}
</script>
<style lang="scss" scoped>
.bi-card {
	position: relative;
	border: 1px solid transparent;
	border-radius: 4px;
	@include size(100%);
	&:hover {
		box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
		.card-menu-btn-wrap {
			display: inline-block;
		}
	}
	&.actived {
		@include set-theme {
			border-color: get-themed-variable('color-theme-primary');
		}
		.card-menu-btn-wrap {
			display: inline-block;
		}
	}
}

.bi-card-inner-wrap {
	padding: 10px 16px 16px;
	@include size(100%);
	.bl-card-header {
		width: calc(100% - 30px);
		::v-deep .ivu-input {
			font-size: 16px;
			font-weight: bold;
			padding: 0;
			background: transparent;
			@include hide-scroll-bar();
			@include set-skin() {
				color: get-bg-changed-variable('color-text-crucial');
			}
		}
		.label-show {
			@include height-lh(25px);
			@include set-skin() {
				color: get-bg-changed-variable('color-text-crucial');
			}
		}
	}
	.bi-conponent-wrap {
		height: calc(100% - 48px);
	}
}
</style>
