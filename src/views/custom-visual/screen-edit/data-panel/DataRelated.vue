<template>
	<div class="data-related-wrap">
		<slot></slot>
		<ComFilter v-bind="$attrs" />
		<!-- 结果显示 -->
		<section class="">
			<bl-form
				:formItems="formItems"
				:defaultValue="modelData"
				:label-width="70"
				itemClass="mb-1"
				class="attr-form-wrap update-rate-form"
				:labelColon="false"
				labelPosition="left"
				itemSize="small">
				<div slot="regreshRate" class="flex-jusfity-start">
					<InputNumber
						v-model="modelData.refreshTime"
						:precision="0"
						:min="0"
						:max="3600"
						style="width: 112px"
						size="small"
						:active-change="false" />
					<Select
						size="small"
						transfer
						transfer-class-name="dark"
						style="width: 60px; margin-left: 4px"
						v-model="modelData.refreshUnit">
						<Option value="minute">分</Option>
						<Option value="second">秒</Option>
					</Select>
				</div>
			</bl-form>
		</section>
		<footer class="update-btn">更新数据</footer>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import ComFilter from './ComFilter.vue'

// 数据联动组件

@Component({
	components: { ComFilter },
})
export default class VisualDataRelated extends Vue {
	modelData = {
		autoRefresh: false,
		refreshTime: 10,
		refreshUnit: 'second',
	}
	// 筛选框配置
	get formItems() {
		return [
			{
				key: 'autoRefresh',
				label: '自动刷新',
				bltype: 'single-checkbox',
			},
			{
				key: 'regreshRate',
				label: '刷新频率',
				bltype: 'slot',
				isHidden: !this.modelData.autoRefresh,
			},
			{
				key: 'size',
				label: '结果展示',
				bltype: 'inputnumber',
				min: 1,
				max: 1000,
			},
		]
	}
}
</script>

<style lang="scss" scoped>
.data-related-wrap {
	.update-btn {
		position: absolute;
		bottom: 20px;
		height: 40px;
		width: calc(100% - 32px);
		margin: 0 16px;
		@include flex-justify-align(center);
		cursor: pointer;
		color: $color-white-100;
		@include set-theme {
			background-color: get-themed-variable('color-theme-primary');
		}
	}
	.update-rate-form {
		margin: 16px 16px 70px;
	}
}

::v-deep .config-block-wrap {
	padding-top: 8px;
	margin: 16px 8px;
	border-radius: 4px;
	background: $color-grey-82;
	.title {
		color: $color-white-100;
		border-left: 2px solid #079087;
		padding: 0 10px;
	}
}
// 拖拽接受容器
::v-deep .drag-receiver-wrap {
	min-height: 30px;
	padding: 0 8px;
	.added-item {
		cursor: pointer;
		padding: 0 10px;
		margin-bottom: 8px;
		@include flex-justify-align(space-between);
		@include height-lh(32px);
		color: $color-white-45;
	}
	.data-name {
		color: $color-white-85;
	}
	.dimension {
		border: 1px solid $dimension-color;
		.show-info i {
			color: $dimension-color;
		}
	}
	.measure {
		border: 1px solid $measure-color;
		.show-info i {
			color: $measure-color;
		}
	}

	.no-data {
		min-height: 76px;
		i {
			font-size: 24px;
		}
		@include flex-dir-justify-align(column, flex-start);
	}

	// 占位元素样式
	.item-chosen,
	.sub-item-chosen {
		padding: 0 10px;
		@include height-lh(32px);
		.sub-tree {
			display: none;
		}
	}
}
</style>
