import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import { setStore, getStore } from '@/scripts/utils'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
	restoreState: key => {
		const resStr = getStore(key)
		if (resStr && typeof resStr === 'string') {
			return JSON.parse(resStr)
		} else {
			return {}
		}
	},
	saveState: (key, state) => {
		setStore(key, JSON.stringify(state))
	},
	// 如果不用这个函指定，那么默认所有vuex数数都作持久化处理
	reducer(val: any) {
		// 只对以下模块作数据持久化
		return {
			commonStore: val.commonStore,
		}
	},
})
export default new Vuex.Store({
	plugins: [vuexLocal.plugin],
})
