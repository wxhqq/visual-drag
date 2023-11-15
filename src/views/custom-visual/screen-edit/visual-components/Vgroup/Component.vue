<template>
	<div class="group">
		<div class="group-marker" :class="{ 'has-parent': nodeInfo.pGuid }">
			<Icon type="md-move" />
		</div>
		<template v-for="(item, index) in nodeInfo.children">
			<Shape
				v-if="!isPreview"
				:key="item.guid"
				:index="index"
				:nodeInfos="item">
				<component :is="item.component" :node-info="item" />
			</Shape>
			<div v-else :key="item.guid" :style="getShapeStyle(item, index)">
				<component :is="item.component" :node-info="item" />
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import {
	Component,
	InjectReactive,
	Prop,
	Vue,
	Watch,
} from 'vue-property-decorator'

// 组合组件
import Shape from '../../components/Shape.vue'

import { ScreenComponent } from '@/store/modules/visual-screen'
import { refreshGroupStyle } from '../../scripts/calculate-util'
import { shapeStyleKeys } from '../../scripts/constants'

const getSingleVComponents = () => {
	const allComponents = require.context(
		'../../visual-components/',
		true,
		/.\/Component\.vue$/
	)
	const componentList = {}

	const matchReg = /^\.\/(\w*)\/(\w*).+$/
	allComponents.keys().forEach(fileName => {
		const component = allComponents(fileName)

		const comName = fileName.replace(matchReg, '$2')
		const key = fileName.replace(matchReg, '$1')
		if (comName === 'Component') {
			componentList[key] = component.default
		}
	})
	return componentList
}

@Component({
	components: {
		Shape,
		...getSingleVComponents(),
	},
})
export default class Vgroup extends Vue {
	@Prop() nodeInfo: ScreenComponent

	@InjectReactive() isPreview: boolean

	// 监听所有子组件的样式
	get getSubComponentsStyles() {
		return this.nodeInfo.children?.map((item: ScreenComponent) => {
			return {
				...item.propStyle,
			}
		})
	}

	@Watch('getSubComponentsStyles', { deep: true })
	onChange() {
		refreshGroupStyle(this.nodeInfo)
	}

	// 获取形状样式
	getShapeStyle(nodeInfos: ScreenComponent, index: number) {
		const { isShow, propStyle } = nodeInfos
		const res = {
			zIndex: index + 5,
			display: isShow ? 'block' : 'none',
			position: 'absolute',
		}
		Object.keys(propStyle).forEach(key => {
			if (shapeStyleKeys.includes(key)) {
				res[key] = `${propStyle[key]}px`
			}
		})
		return res
	}
}
</script>

<style lang="scss" scoped>
.group {
	position: relative;
	width: 100%;
	height: 100%;
	.shape {
		position: absolute;
	}
}
.group-marker {
	position: absolute;
	top: -10px;
	left: 50%;
	@include set-theme {
		background-color: get-themed-variable('color-theme-primary');
	}
	@include size(20px);
	color: $color-white-100;
	z-index: 10000;
	display: none;
	border-radius: 10px;
	text-align: center;
	transform: translateX(-50%);

	&.has-parent {
		transform: translateX(200%);
	}
}
</style>
