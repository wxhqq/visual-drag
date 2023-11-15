<template>
	<div class="data-tree-wrapper" :class="`${category}-tree`">
		<p class="mb-8px data-title">
			{{ category === 'dimension' ? '维度' : '度量' }}
			（{{ treeList.length }}）
		</p>
		<ul class="data-tree-list hide-scroll-bar">
			<draggable
				v-model="treeList"
				:group="dragSender"
				animation="300"
				:sort="false"
				:forceFallback="true"
				chosen-class="item-chosen"
				drag-class="item-fallback"
				filter=".sub-tree">
				<li
					v-for="item in treeList"
					:key="item.field"
					:field="item.field"
					:class="`${category}-li`"
					:category="item.category">
					<div class="data-item" :class="`${category}-item`">
						<i :class="filedTypeIconMap[item.fieldType]" />
						<span class="ml-4px">{{ item.name }}</span>
					</div>
					<draggable
						v-if="item.chrildren && item.chrildren.length"
						v-model="item.chrildren"
						:group="dragSender"
						:sort="false"
						animation="300"
						chosen-class="item-chosen"
						class="sub-tree">
						<template v-for="sub in item.chrildren">
							<div
								:key="sub.field"
								:field="sub.field"
								:category="sub.category"
								class="data-item"
								:class="`${category}-item`">
								<i :class="filedTypeIconMap[sub.fieldType]" />
								<span class="ml-4px">{{ sub.name }}</span>
							</div>
						</template>
					</draggable>
				</li>
			</draggable>
		</ul>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import draggable from 'vuedraggable'
import { DataFieldType } from '../scripts/visual-type'
import { dataFiledTypeIconMap } from '../scripts/constants'
// 组件

@Component({
	components: {
		draggable,
	},
})
export default class ComDataTree extends Vue {
	@Prop() treeList: DataFieldType[]
	@Prop({ default: 'dimension' }) category: 'dimension' | 'measure'

	// 字段类型图标
	filedTypeIconMap = dataFiledTypeIconMap

	// 拖拽配置
	dragSender = {
		name: 'dragReceiver',
		pull: 'clone',
		put: false,
	}
}
</script>

<style lang="scss" scoped>
.data-tree-wrapper {
	position: relative;
	height: 50%;
	overflow: hidden;

	border-radius: 4px;
	margin: 16px 8px;
	color: $color-white-85;
	.data-title {
		color: $color-white-100;
		padding: 10px 12px 0;
	}
	ul {
		height: calc(100% - 50px);
		overflow-y: auto;
	}
	.data-item {
		cursor: pointer;
		transition: background-color 0.3s;
		user-select: none;
		padding: 0 10px;
		@include height-lh(32px);
		@include ellipsis();
	}
	&::before {
		position: absolute;
		display: inline-block;
		@include size(2px, 22px);
		content: '';
		top: 8px;
		left: 0;
	}
}

.dimension-tree {
	background-color: rgba($dimension-color, 0.25);
	.dimension-item {
		&:hover {
			background-color: rgba($dimension-color, 0.4);
		}
		i {
			color: $dimension-color;
		}
	}
	&::before {
		background: $dimension-color;
	}
}
.measure-tree {
	background-color: rgba($measure-color, 0.25);
	.measure-item {
		&:hover {
			background-color: rgba($measure-color, 0.4);
		}
		i {
			color: $measure-color;
		}
	}
	&::before {
		background: $measure-color;
	}
}

.sub-tree .data-item {
	padding-left: 20px;
}

// 拖动的元素样式
.item-fallback {
	max-height: 32px !important;
	&.dimension-li {
		background-color: rgba($dimension-color, 0.4);
	}
	&.measure-li {
		background-color: rgba($measure-color, 0.4);
	}
	.sub-tree {
		display: none;
	}
}
</style>
