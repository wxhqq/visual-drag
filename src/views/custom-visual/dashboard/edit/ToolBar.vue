<template>
	<div class="dashboard-tool-bar dark">
		<div class="left flex-justify-start">
			<ComAddPanel />
			<!-- 撤销、重做 -->
			<div class="operation-btns">
				<i
					class="bl-icon-undo"
					title="撤销"
					@click="undo"
					:class="{ disabled: disableUndo }"></i>
				<i
					class="bl-icon-redo"
					title="重做"
					@click="redo"
					:class="{ disabled: disableRedo }"></i>
			</div>
		</div>
		<div class="center">
			<Button @click="biPageSetting" custom-icon="bl-icon-menu-visual">
				页面配置
			</Button>
		</div>
		<div class="right">
			<Button
				custom-icon="bl-icon-visible"
				@click="$router.push('/dashboardPreview')">
				预览
			</Button>
			<Button
				class="ml-8px"
				custom-icon="bl-icon-save"
				type="primary"
				@click.stop="save">
				保存
			</Button>
			<!-- 退出 -->
			<Icon
				class="ml-8px"
				custom="bl-icon-exit light-txt"
				title="退出"
				@click="$router.go(-1)" />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getChartsCompnents } from '../../screen-edit/scripts/constants'
import ComAddPanel from './components/ComAddPanel.vue'

import VisualDashboardStore, {
	BiComponent,
} from '@store/modules/visual-dashboard'
import VisualDashboardRollback from '@store/modules/visual-dashboard-rollback'
import { deepClone } from '@/scripts/utils'

// 组件

@Component({
	components: { ComAddPanel },
})
export default class OcBiToolBar extends Vue {
	// 图表组件
	chartsCompnents = getChartsCompnents('dashboard')

	// 页面设置
	biPageSetting() {
		VisualDashboardStore.resetActiveComponent()
	}
	// 撤销禁用
	get disableUndo() {
		return VisualDashboardRollback.curIndex === 0
	}
	// 重做禁用
	get disableRedo() {
		const { length } = VisualDashboardRollback.rollbackList
		return !length || VisualDashboardRollback.curIndex >= length - 1
	}
	// 撤销
	undo() {
		VisualDashboardRollback.undo()
	}

	// 重做
	redo() {
		VisualDashboardRollback.redo()
	}

	// 保存， 将属性转为str
	save() {
		const params = {
			themeOptions: { ...VisualDashboardStore.themeOptions },
			components: deepClone(VisualDashboardStore.allAddedComponents).map(
				(item: BiComponent) => {
					const { propStyle, attrStyle, ...others } = item
					return {
						...others,
						attrStyle: JSON.stringify(attrStyle),
						propStyle: JSON.stringify(propStyle),
					}
				}
			),
		}
		deepClone(VisualDashboardStore.allAddedComponents)
		console.log(params)
	}
}
</script>

<style lang="scss" scoped>
.dashboard-tool-bar {
	height: 64px;
	background-color: $color-grey-92;
	color: $color-white-85;
	display: grid;
	grid-template-columns: 1fr 1fr 300px;
	.left {
		align-self: center;
		padding: 0 32px;
	}
	.center {
		align-self: center;
		justify-self: right;
		padding: 0 32px;
	}
	.right {
		border-left: 1px solid $color-grey-75;
		@include flex-justify-align(flex-end);
		padding-right: 24px;
	}
}

.operation-btns {
	margin-left: 16px;
	padding-left: 16px;
	border-left: 1px solid $color-grey-75;
	i {
		display: inline-block;
		@include size(32px);
		line-height: 32px;
		border-radius: 2px;
		text-align: center;
		border: 1px solid $color-grey-75;
		margin-right: 8px;
		cursor: pointer;
		&:not(.disabled):hover {
			@include set-theme {
				color: get-themed-variable('color-theme-primary');
				border-color: get-themed-variable('color-theme-primary');
			}
		}

		&.disabled {
			border: 1px solid $color-grey-82;
			cursor: not-allowed;
			color: $color-white-45;
		}
	}
}
</style>
