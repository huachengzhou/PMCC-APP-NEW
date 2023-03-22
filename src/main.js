import Vue from 'vue'
import App from './App'
import md5 from './common/md5.min.js'
import config from './common/config.js'
import store from './store'
import formatTime from './common/datetime.js'
import helper from './common/helper.js'
import * as commonUtils from './common/untils.js' 
import * as commonKey from "./common/commonKey.js";
import myRequest from './common/request/request.js'

Vue.config.productionTip = false

Vue.prototype.$md5 = md5
Vue.prototype.$config = config
Vue.prototype.$store = store
Vue.prototype.formatTime=formatTime
Vue.prototype.$helper = helper
Vue.prototype.$commonUtils = commonUtils
Vue.prototype.$commonKeys = commonKey
Vue.prototype.$myRequest = myRequest

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
