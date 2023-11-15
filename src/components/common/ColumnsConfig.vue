<template>
	<Poptip
		transfer
		placement="bottom-end"
		@on-popper-show="isActive = true"
		@on-popper-hide="isActive = false">
		<Icon
			custom="bl-icon-setting"
			class="columns-ctrl-btn"
			:class="{ active: isActive }" />
		<ul slot="content">
			<!-- 列重置 -->
			<Button type="text" class="primary" @click="resetColumns">
				重置列表
			</Button>
			<Divider class="mt-8px mb-12px" />
			<div class="check-items hide-scroll-bar">
				<li
					v-for="(item, index) in checkColumns"
					:key="index"
					class="mt-4px">
					<Checkbox
						v-model="item.isShow"
						:disabled="
							(isNoFixed && index == 0) ||
							(item.isShow && !!item.fixed)
						"
						@on-change="changeColumnShow(item, $event)">
						{{ item.title }}
					</Checkbox>
				</li>
			</div>
		</ul>
	</Poptip>
</template>

<script lang="ts">
import { Component, PropSync, Prop, Vue, Watch } from 'vue-property-decorator'
import { setStore, getStore } from '@utils'
type ColType = {
	key?: string
	title?: string
	slot?: string
	isHidden?: boolean
	isShow?: boolean
	type?: 'index' | 'selection' | 'expand' | 'html'
	fixed: 'left' | 'right'
}

@Component
export default class ColumnsConfig extends Vue {
	@PropSync('columns') columnsSync: ColType[]
	//列表名称 用来标识是哪个列表，存储列配置信息 必须要保证唯一性  必须要已columns-作为前缀
	@Prop({
		required: true,
		validator: function (value: string) {
			return value.includes('columns-')
		},
	})
	listName: string

	isActive = false
	// 默认的列配置
	defaultHideCols: ColType[] = []
	// 需要勾选的列
	get checkColumns() {
		const res: ColType[] = []
		this.columnsSync.forEach(col => {
			const { type, isHidden = false } = col
			if (type !== 'selection' && type !== 'expand') {
				res.push({
					isShow: !isHidden,
					...col,
				})
			}
		})
		return res
	}
	// 没有固定列时，需要禁止所有列都被隐藏
	get isNoFixed() {
		return this.columnsSync.every(item => !item.fixed)
	}
	@Watch('listName', { deep: true, immediate: true })
	onListNameChange() {
		this.columnsSync.forEach((col: ColType) => {
			const { type, key, slot } = col
			const ID = type || key || slot
			ID && (this.defaultHideCols[ID] = col.isHidden)
		})
		// 如果勋在listname 则缓存列配置
		if (this.listName) {
			const configStr = getStore(this.listName)
			if (!configStr) {
				//不存在缓存  第一次进入 需要设置缓存
				this.storeColumns()
			} else {
				//存在缓存， 从缓存中取数据
				const config = JSON.parse(configStr)
				this.columnsSync = this.columnsSync.map((col: ColType) => {
					const { type, key, slot } = col
					const ID = type || key || slot
					if (
						ID &&
						Object.prototype.hasOwnProperty.call(config, ID)
					) {
						col.isHidden = config[ID]
					}
					return col
				})
			}
		}
	}
	// 重置列
	resetColumns() {
		this.columnsSync = this.columnsSync.map((col: ColType) => {
			const { type, key, slot } = col
			const ID = type || key || slot //type, key, slot  三个属性必须确保有一个
			if (ID) {
				col.isHidden = this.defaultHideCols[ID]
			}
			return col
		})
		this.storeColumns()
	}
	// 配置列显示
	changeColumnShow({ key, type, slot }: ColType, isShow: boolean) {
		this.columnsSync = this.columnsSync.map(col => {
			if (col.key === key && col.type === type && col.slot === slot) {
				col.isHidden = !isShow
			}
			return col
		})
		this.storeColumns()
	}
	// 缓存列配置
	storeColumns() {
		// 如果勋在listname 则缓存列配置
		if (this.listName) {
			const storeData = {}
			this.columnsSync.forEach((col: ColType) => {
				const { type, key, slot, isHidden } = col
				const ID = type || key || slot //type, key, slot  三个属性必须确保有一个
				if (ID) {
					storeData[ID] = isHidden
				}
			})
			setStore(this.listName, JSON.stringify(storeData))
		}
	}
}
</script>

<style lang="scss" scoped>
.columns-ctrl-btn {
	cursor: pointer;

	&.active {
		@include set-theme {
			color: get-themed-variable('color-theme-secondary');
		}
	}
}

.columns-ctrl-reset {
	padding: 8px 16px;
}
.check-items {
	max-height: 400px;
	overflow-y: auto;
}
</style>
