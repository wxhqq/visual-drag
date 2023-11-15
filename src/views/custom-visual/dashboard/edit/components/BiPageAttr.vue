<template>
	<div class="bi-page-settings">
		<div class="title">页面设置</div>
		<div class="page-attr-wrap">
			<bl-form
				:formItems="formItems"
				:defaultValue="themeOptions"
				:label-width="70"
				itemClass="mb-1"
				:labelColon="false"
				labelPosition="left"
				itemSize="small">
				<ul slot="backgroundImg" class="bg-list">
					<li
						v-for="(bg, index) in bgImgOptions"
						:key="index"
						:class="{
							actived: themeOptions.backgroundImg == bg,
						}"
						@click="onChangeBgImg(bg)">
						<img
							height="100%"
							:src="
								require(`@assets/custom-visual/dashboard/thumbnail-theme-bg-${bg}.png`)
							" />
					</li>
				</ul>
			</bl-form>
		</div>
		<Collapse class="coolapse-wrap" simple>
			<Panel name="colorType">
				调色盘
				<template slot="content">
					<Select
						size="small"
						transfer
						transfer-class-name="dark"
						v-model="themeOptions.colorType"
						@on-change="onChangeColorType"
						class="mb-12px">
						<Option
							v-for="(colors, key) in CHART_COLOR_MAP"
							:key="key"
							:value="key"
							:label="`色系${key}`">
							<ul class="flex-justify-start color-option-wrap">
								<li
									v-for="(color, index) in colors.slice(
										0,
										10
									)"
									:key="index"
									:style="{ background: color }"></li>
								<span>色系{{ key }}</span>
							</ul>
						</Option>
					</Select>
				</template>
			</Panel>
		</Collapse>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import VisualDashboardStore from '@store/modules/visual-dashboard'
import VisualDashboardRollback from '@store/modules/visual-dashboard-rollback'
import { CHART_COLOR_MAP } from '../../../screen-edit/scripts/constants'

/**
 * 页面属性
 */

@Component
export default class OcBiPageAttr extends Vue {
	bgImgOptions = ['1', '2']
	CHART_COLOR_MAP = CHART_COLOR_MAP

	// 页面样式
	get themeOptions() {
		return VisualDashboardStore.themeOptions
	}

	get formItems() {
		return [
			{
				key: 'skin',
				label: '主题',
				bltype: 'radio',
				options: [
					{ label: '浅色', value: 'light' },
					{ label: '深色', value: 'dark' },
				],
				onChange: (val: string) => {
					if (val === 'light') {
						this.themeOptions.backgroundColor = '#f2f3f8'
					} else {
						this.themeOptions.backgroundColor = 'rgba(0, 0, 0, 1)'
					}
					this.updateRollback()
				},
			},
			{
				key: 'backgroundColor',
				label: '页面背景',
				bltype: 'color',
				onChange: this.updateRollback,
			},
			{
				key: 'backgroundImg',
				label: '页面图片',
				bltype: 'slot',
				onChange: this.updateRollback,
			},
			{
				key: 'cardRadius',
				label: '卡片圆角',
				bltype: 'radio',
				options: [
					{ label: '无', value: '0' },
					{ label: '小', value: '6px' },
					{ label: '大', value: '12px' },
				],
				onChange: this.updateRollback,
			},
			{
				key: 'cardGap',
				label: '卡片间隙',
				bltype: 'radio',
				options: [
					{ label: '紧凑', value: 8 },
					{ label: '常规', value: 16 },
				],
				onChange: this.updateRollback,
			},
		]
	}

	// 改变图片
	onChangeBgImg(bg: string) {
		if (this.themeOptions.backgroundImg === bg) {
			this.themeOptions.backgroundImg = ''
		} else {
			this.themeOptions.backgroundImg = bg
		}
		this.updateRollback()
	}
	// 改变颜色
	onChangeColorType() {
		VisualDashboardStore.allAddedComponents.forEach(item => {
			if (item.attrStyle.hasOwnProperty('colorType')) {
				item.attrStyle['colorType'] = this.themeOptions.colorType
			}
		})
		this.updateRollback()
	}

	// 更新回滚记录
	updateRollback() {
		VisualDashboardRollback.pushRecord()
	}
}
</script>

<style lang="scss" scoped>
@import '../../../styles/visual-screen/coolapse.scss';
.title {
	color: $color-white-100;
	font-weight: bold;
	padding: 16px 16px 0;
}
.page-attr-wrap {
	padding: 16px 16px 0 16px;
}

.bg-list {
	@include flex-justify-align();
	margin-top: 4px;
	li {
		border-radius: 2px;
		padding: 2px;
		text-align: center;
		height: 30px;
		cursor: pointer;

		@include set-skin() {
			border: 1px solid get-bg-changed-variable('color-border-default');
		}
		&:last-child {
			margin-left: 8px;
		}

		&.actived {
			@include set-theme {
				border-color: get-themed-variable('color-theme-secondary');
			}
		}
	}
}
.color-option-wrap {
	align-items: center;
	height: 100%;
	li {
		@include size(12px);
		border-radius: 3px;
		margin-right: 4px;
	}
}
</style>
