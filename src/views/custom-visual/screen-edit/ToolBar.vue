<template>
	<ul class="header">
		<li class="left"></li>
		<li class="center">
			<div class="operation-wrap flex-justify-start">
				<!-- 组件资源 -->
				<ComAddPanel :componentData="chartsCompnents">
					<Button custom-icon="bl-icon-add" type="primary">
						添加图表
					</Button>
				</ComAddPanel>
				<ComAddPanel :componentData="commonCompnents" class="ml-8px">
					<Button custom-icon="bl-icon-add">通用组件</Button>
				</ComAddPanel>
				<!-- 撤销、重做 -->
				<div class="operation-btns">
					<i
						class="bl-icon-undo"
						title="撤销：Ctrl+Z"
						:class="{ disabled: disableUndo }"
						@click="undo"></i>
					<i
						class="bl-icon-redo"
						:class="{ disabled: disableRedo }"
						title="重做：Shift+Ctrl+Z"
						@click="redo"></i>
				</div>
			</div>
			<EditorTools />
		</li>
		<li class="right">
			<Button custom-icon="bl-icon-visible" @click.stop="preview">
				预览
			</Button>
			<Button
				class="ml-8px"
				custom-icon="bl-icon-save"
				@click.stop="save">
				保存
			</Button>
			<!-- 退出 -->
			<Icon
				class="ml-8px"
				custom="bl-icon-exit light-txt"
				title="退出"
				@click="$router.go(-1)" />
		</li>
	</ul>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import EditorTools from './components/EditorTools.vue'
import ComAddPanel from './components/ComAddPanel.vue'
// 工具组件

import VisualScreenRollback from '@store/modules/visual-screen-rollback'
import VisualScreenStore from '@store/modules/visual-screen'
import { getChartsCompnents, getCommonComponents } from './scripts/constants'

@Component({
	components: { EditorTools, ComAddPanel },
})
export default class ToolBar extends Vue {
	// 通用组件
	commonCompnents = getCommonComponents()
	// 图表组件
	chartsCompnents = getChartsCompnents()

	// 撤销禁用
	get disableUndo() {
		return VisualScreenRollback.curIndex === 0
	}
	// 重做禁用
	get disableRedo() {
		const { length } = VisualScreenRollback.rollbackList
		return !length || VisualScreenRollback.curIndex >= length - 1
	}
	// 撤销
	undo() {
		VisualScreenRollback.undo()
	}

	// 重做
	redo() {
		VisualScreenRollback.redo()
	}
	save() {
		console.log(VisualScreenStore.allAddedComponents)
	}
	preview() {
		this.$router.push('/screenPreview')
	}
}
</script>

<style lang="scss" scoped>
.font-white-45 {
	color: $color-white-45;
}
.top-border {
	border-top: 1px solid $color-grey-75;
}
.header {
	height: 64px;
	background-color: $color-grey-92;
	border-bottom: 1px solid $color-grey-75;
	display: grid;
	grid-template-columns: 240px 1fr 300px;
	li {
		display: flex;
		align-items: center;
		padding: 0 24px;
	}
	.center {
		justify-content: space-between;
		border-left: 1px solid $color-grey-75;
	}
	.right {
		border-left: 1px solid $color-grey-75;
		justify-content: flex-end;
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
		// color: $color-white-85;
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
