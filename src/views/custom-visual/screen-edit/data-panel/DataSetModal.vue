<template>
	<Modal
		width="992"
		title="数据集"
		:value="isShow"
		:closable="true"
		:footer-hide="true"
		:mask-closable="true"
		@on-cancel="closeModal"
		class-name="bolean-modal">
		<div class="data-set-detail flex-justify-start">
			<aside>
				<Input
					v-model="searchSetValue"
					class="mb-8px"
					placeholder="请搜索"
					clearable
					suffix="ios-search" />
				<ul class="data-set-list">
					<li
						v-for="(item, key) in filterDateSets"
						:key="key"
						:class="{ actived: item.id === selectedDateSetID }"
						@click="selectedDateSetID = item.id">
						{{ item.name }}
					</li>
				</ul>
			</aside>
			<main>
				<!-- 列表 -->
				<Table
					ref="bltable"
					:columns="tableColumns"
					:height="530"
					:data="tableList"></Table>
			</main>
		</div>
	</Modal>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator'
/**
 * 数据集详情
 */
@Component
export default class VisualDataSetModal extends Vue {
	// 用于控制弹窗显示隐藏的 value v-model 传入的
	@PropSync('value') isShow: boolean
	// 当前选中数据集
	selectedDateSetID = 1
	// 搜索数据集
	searchSetValue = ''
	// 搜索过滤后的数据集
	get filterDateSets() {
		return this.dataSets.filter(item => {
			return item.name.includes(this.searchSetValue)
		})
	}
	// 数据集
	dataSets = Array.from({ length: 10 }).map((item, i) => {
		return {
			name: `数据集${i + 1}`,
			id: i + 1,
		}
	})
	// 表格信息
	tableColumns = Array.from({ length: 16 }).map((item, i) => {
		if (i < 8) {
			return {
				title: `维度${i + 1}`,
				key: `key${i}`,
				minWidth: 100,
			}
		}
		return {
			title: `度量${i + 1}`,
			key: `key${i}`,
			minWidth: 100,
		}
	})

	tableList = []

	closeModal() {
		this.isShow = false
	}
}
</script>
<style lang="scss" scoped>
.data-set-detail {
	height: 540px;
	overflow: hidden;
	aside {
		min-width: 240px;
	}
	main {
		flex: 1;
		overflow: hidden;
		margin-left: 16px;
	}
}

.data-set-list {
	li {
		cursor: pointer;
		@include height-lh(28px);
		padding: 0 8px;
		&:hover {
			@include set-theme {
				background-color: rgba(
					get-themed-variable('color-theme-primary'),
					0.2
				);
			}
		}
		&.actived {
			@include set-theme {
				background-color: get-themed-variable('color-theme-primary');
			}
			color: $color-white-100;
		}
	}
}
</style>
