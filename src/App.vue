<template>
	<div id="app" class="web-app">
		<router-view class="web-container" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CommonStore from '@store/modules/common'

@Component
export default class App extends Vue {
	mounted() {
		CommonStore.initAppearance()
	}
}
</script>

<style lang="scss">
.web-app {
	max-width: 100vw;
	height: 100vh;
	min-width: 1200px;
	overflow-x: auto;
	overflow-y: hidden;
	@include flex-dir(column);
}

.web-body {
	display: flex;
	align-items: stretch;
	flex: 1;
	overflow: hidden;
	@include set-background {
		background-color: get-bg-changed-variable('color-body-bg');
	}

	.web-container {
		flex: 1;
	}
}
</style>
