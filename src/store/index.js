import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userInfo: {},
		hasLogin: false
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			try{
				uni.setStorageSync('userInfo', provider);
			} catch(e) {
				
			}
		},
		logout(state) {
			state.hasLogin = false;
			state.uerInfo = {};
			try{
				uni.removeStorageSync('userInfo');
			} catch(e) {
				
			}
		}
	}
})

export default store;