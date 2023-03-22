// import Vue from 'vue';
import helper from './helper.js';
import configHost from './config.js';
import request from './request/request';

export const Constant = {
	async: 'async',
	synchronize: 'synchronize'
};

/**
 *  filters.js
 * 对Date的扩展，将 Date 转化为指定格式的String  默认是2019-11-25 14:00:00 需要格式则后续传值
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2019-11-25 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2019-11-25 8:9:4.18
 * 使用格式,dom上 {{formatTime(time,'YYYY-MM-DD')}}
 * 在script中 this.formatTime(this.time,"hh:mm:ss")
 * 
 */

Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"D+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(Y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k])
				.length)));
	return fmt;
}
export function formatTime(times, pattern) {
	var d = new Date(times).Format("YYYY-MM-DD hh:mm:ss");
	if (pattern) {
		d = new Date(times).Format(pattern);
	}
	return d.toLocaleString();
}


export function formatTimeNewBillZh(times) {
	var dateFormat = /^(\d{4})[-年]?(\d{1,2})[-月]?(\d{1,2})/;
	let arr = times.match(dateFormat);
	if (arr == null || arr == '') {
		return '';
	}
	if (isArrayNotEmpty(arr)) {
		let str = ''; //'2017-1-3'
		let newArr = [arr[1], arr[2], arr[3]];
		// var date = new Date(newArr.join("-"));
		return newArr.join("-");
	} else {
		return '';
	}
	return '';
}

// 转换YYYY年MM月DD日 为 YYYY-MM-DD
export function formatTimeZh(times) {
	var reg = /(\d{4})\年(\d{2})\月(\d{2})日/;
	var date = times.replace(reg, "$1-$2-$3");
	return date;
}
/* 判断结束时间大于开始时间 */
export function checkDateEndGreaterThenStart(startDate, endDate) {
	var dateSpan, iDays;
	//兼容IOS时间类
	startDate = startDate.replace(/-/g, "/");
	endDate = endDate.replace(/-/g, "/");
	let sDate1 = new Date(startDate).getTime();
	let sDate2 = new Date(endDate).getTime();

	return sDate2 > sDate1;
}

/*
 * 验证手机号是否合格
 * true--说明合格
 */
export function isPhone(phoneStr) {
	let myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
	if (!myreg.test(phoneStr)) {
		return false;
	} else {
		return true;
	}
}

/*
 * 验证身份证号是否合格
 * true--说明合格
 */
export function isIdCard(idCardStr) {
	let idcardReg =
		/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
	if (idcardReg.test(idCardStr)) {
		return true;
	} else {
		return false;
	}
}

/**
 * 验证车牌号是否合格
 * true--说明合格
 */
export function isVehicleNumber(vehicleNumber) {
	let xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
	let creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
	if (vehicleNumber.length == 7) {
		return creg.test(vehicleNumber);
	} else if (vehicleNumber.length == 8) {
		return xreg.test(vehicleNumber);
	} else {
		return false;
	}
}

/*
 * 验证字符串是否为空（也不能为纯空格）
 * true--说明为空， false--说明不为空
 */
export function isEmptyString(string) {
	if (typeof(string) == 'number') {
		return false;
	}
	if (
		string == undefined ||
		typeof string == 'undefined' ||
		!string ||
		string == null ||
		string == '' ||
		/^\s+$/gi.test(string)
	) {
		return true;
	} else {
		return false;
	}
}

export function isNotEmptyString(string) {
	return !isEmptyString(string);
}

/**
 * 判断对象 属性
 */
export function isNotBlankObjectProperty(obj) {
	for (var key in obj) {
		if (isNotEmptyString(obj[key])) {
			return true;
		}
	}
	return false
}

//比较表单中的值是否有变化
export function compareFormProperty(newValue, oldValue, name) {
	if (!newValue) {
		return true;
	}
	if (!oldValue) {
		return true;
	}
	let temp1 = newValue[name];
	let temp2 = oldValue[name];
	if (isNotEmptyString(temp2) && isNotEmptyString(temp1)) {
		return temp2 == temp1;
	}
	if (isEmptyString(temp2) && isNotEmptyString(temp1)) {
		return false;
	}
	return true;
}


export function compareFormPropertyTool(newValue, oldValue, name) {
	if (!compareFormProperty(newValue, oldValue, name)) {
		return isNotEmptyString(newValue[name]);
	}
	return false;
}

/*
 * 生日转为年龄（精确到月份）
 */
export function birsdayToAge(birsday) {
	let aDate = new Date();
	let thisYear = aDate.getFullYear();
	let bDate = new Date(birsday);
	let brith = bDate.getFullYear();
	let age = thisYear - brith;
	if (aDate.getMonth() == bDate.getMonth()) {
		if (aDate.getDate() < bDate.getDate()) {
			age = age - 1;
		}
	} else {
		if (aDate.getMonth() < bDate.getMonth()) {
			age = age - 1;
		}
	}
	return age;
}

/**
 * 判断数据类型
 * @param {any} val - 基本类型数据或者引用类型数据
 * @return {string} - 可能返回的结果有，均为小写字符串
 * number、boolean、string、null、undefined、array、object、function等
 */
export function getType(val) {
	//判断数据是 null 和 undefined 的情况
	if (val == null) {
		return val + "";
	}
	return typeof(val) === "object" ?
		Object.prototype.toString.call(val).slice(8, -1).toLowerCase() :
		typeof(val);
}

/*
 * 验证是否为数字
 */
export function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}


/**
 * 提取数字
 * @param {Object} text
 */
export function getNumber(text) {
	 var num = text.replace(/[^0-9]/ig,"");
	 return parseFloat(num) ;
}

/*
 * 是否为数组
 */
export function isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}

/*
 * 是否空数组
 */
export function isArrayEmpty(val) {
	return !isArrayNotEmpty(val);
}


export function splitString(text, separator) {
	if (!isNotEmptyString(separator)) {
		separator = ",";
	}
	let arr = [];
	if (isNotEmptyString(text)) {
		arr = text.split(separator);
	}
	return arr;
}

export function splitAssessString(text, separator) {
	let arr = splitString(text, separator);
	if (isArrayEmpty(arr)) {
		arr.push('');
	}
	return arr;
}

/*
 * 是否空数组
 */
export function isArrayNotEmpty(val) {
	if (isArray(val)) {
		return val.length > 0;
	}
	return false;
}

/*
 * 获取url参数字符串
 * 没有返回null
 */
export function getQueryString(name) {
	let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	let r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
}

/**
 * js解析url参数的方法
 * @param {Object} url
 */
export function parseQueryString(url) {
	if (!url) {
		url = decodeURI(location.search); // 获取url中"?"符后的字串(包括问号)
	}
	let query = {};
	if (url.indexOf("?") != -1) {
		const str = url.substr(1);
		const pairs = str.split("&");
		for (let i = 0; i < pairs.length; i++) {
			const pair = pairs[i].split("=");
			query[pair[0]] = pair[1];
		}
	} else {
		const pairs = url.split("&");
		for (let i = 0; i < pairs.length; i++) {
			const pair = pairs[i].split("=");
			query[pair[0]] = pair[1];
		}
	}
	return query; // 返回对象
}

/*
 * 递归深拷贝
 */
export function deepCopy(obj) {
	let result = Array.isArray(obj) ? [] : {};
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (typeof obj[key] === 'object' && obj[key] !== null) {
				result[key] = deepCopy(obj[key]);
			} else {
				result[key] = obj[key];
			}
		}
	}
	return result;
}

export function assignObj(o1, o2) {
	//Object.assign()对象进行处理，assign()是属于合并式的浅拷贝o1中如果有o2中参数时将会覆盖反之将添加
	let obj = Object.assign(o1, o2);
	return obj;
}

/**
 * 去除参数空数据（用于向后台传递参数的时候）
 * @param {Object} obj [参数对象]
 */
export function filterEmptyData(obj) {
	for (let prop in obj) {
		obj[prop] === '' ? delete obj[prop] : obj[prop];
	}
	return obj;
}

/**
 * @desc  函数防抖，用于将多次执行变为最后一次执行
 * @param {function} func - 需要使用函数防抖的被执行的函数。必传
 * @param {Number} wait - 多少毫秒之内触发，只执行第一次，默认1000ms。可以不传
 */
export function debounce(fn, delay) {
	delay = delay || 1000; //默认1s后执行
	let timer = null;
	return function() {
		let context = this;
		let arg = arguments;
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			fn.apply(context, arg);
		}, delay);
	};
}

/**
 * 节流函数, 用于将多次执行变为每隔一段时间执行
 * @param fn 事件触发的操作
 * @param delay 间隔多少毫秒需要触发一次事件
 */
export function throttle2(fn, delay) {
	let timer = null;
	return function() {
		let context = this;
		let args = arguments;
		if (!timer) {
			timer = setTimeout(function() {
				fn.apply(context, args);
				clearTimeout(timer);
			}, delay);
		}
	};
}


//js对象转成路径参数
export function parseParam(param) {
	var arr = [];
	var keys = Object.keys(param);
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var value = param[key];
		if (!value) {
			// continue ;
		}
		var paramStr = key + "=" + value;
		arr.push(paramStr)
	}
	return arr.join("&");
};

/** 
 * param 将要转为URL参数字符串的对象 
 * key URL参数字符串的前缀 
 * encode true/false 是否进行URL编码,默认为true 
 *  
 * return URL参数字符串 
 */
var urlEncodeFun = function(param, key, encode) {
	if (param == null) return '';
	var paramStr = '';
	var t = typeof(param);
	if (t == 'string' || t == 'number' || t == 'boolean') {
		paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
	} else {
		for (var i in param) {
			var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
			paramStr += urlEncodeFun(param[i], k, encode);
		}
	}
	return paramStr;
};

//js对象转成路径参数
export function parseNewParam(param, key, encode) {
	return urlEncodeFun(param, key, encode);
};


export function getNotNullParam(param) {
	let obj = {};
	var keys = Object.keys(param);
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var value = param[key];
		if (value != 0 && value != '0') {
			if (!value) {
				continue;
			}
		}
		obj[key] = value;
	}
	return obj;
};



//只支持异步
export function requestServerCommonMethod(option) {
	let requestType = option.requestType; //方法请求类型
	let url = option.url; //仅仅是 Controller地址(非包括host的url)
	let query = getNotNullParam(option.query); //参数
	let signData = getNotNullParam(option.signData); //md5参数 
	let successCallback = option.successCallback; //回调成功函数
	let errorCallback = option.errorCallback; //回调失败函数
	let showLoading = option.showLoading;
	if (!query) {
		query = {};
	}
	let urlParam = false;
	if (option.notParam) {
		urlParam = true;
	} else {
		urlParam = !isNotBlankObjectProperty(query);
	}
	//当 query中没有元素的时候urlParam 为 true
	let optionRequest = {
		showLoading: showLoading,
		url: url,
		method: requestType,
		data: signData,
		urlParam: urlParam
	};

	request.pmccRequest(optionRequest).then(res => {
		if (res.data.ret) {
			if (successCallback) {
				successCallback(res.data.data);
			}
		} else {
			uni.showToast({
				title: res.data.errmsg,
				mask: true,
				duration: 1000
			});
			if (errorCallback) {
				errorCallback(res.data.errmsg);
			}
		}
	}).catch(res => {
		console.log(res);
		if (errorCallback) {
			errorCallback(res.errmsg);
		}
	});

}


//请求方法封装  
export function requestServerMethod(option) {
	requestServerCommonMethod(option);
}

export function requestServer(option) {
	let notParam = option.notParam; //假如你把参数拼接到了url上但是又不想请求中再带有data 有值,当notParam为true那么query设为null
	if (notParam) {
		option.query = {};
	}
	requestServerMethod(option);
}


export function requestDefault(config) {
	let option = {
		showLoading: config.showLoading,
		url: config.url,
		query: config.query,
		signData: config.query,
		notParam: config.notParam,
		async: config.async,
		successCallback: config.successCallback,
		requestType: "POST",
		errorCallback: config.errorCallback
	};
	requestServer(option);
}

export function containString(source, search) {
	if (isEmptyString(source)) {
		return false;
	}
	return source.indexOf(search) != -1;
}

export function getMapLength(map) {
	let count = 0;
	map.forEach(function(key) {
		// 　　console.log("key",key)  //输出的是map中的value值
		count++;
	});
	return count;
}

export function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}

export function getItemShowName(name, index) {
	if (name) {
		if (name == 'null') {
			return "";
		}
		if (name == 'undefined') {
			return "";
		}
	}
	if (name == null || name == undefined) {
		return "";
	}
	let text = "";
	text = name + "";
	let len = 15;
	if (index) {
		len = index;
	}
	if (text.length > len) {
		text = text.slice(0, len - 1);
		text += "...... ";
	}
	return text;
}

export function getOldRules(arr, required) {
	if (required == null || required == undefined || required == '') {
		required = false;
	}
	let rule = {
		rules: [{
			required: required,
			errorMessage: '请输入数据'
		}]
	};

	let rules = {};
	for (var i = 0; i < arr.length; i++) {
		var name = arr[i];
		rules[name] = rule;
	}

	return rules;
}

export function getRules(arr) {
	let rules = {};
	for (var i = 0; i < arr.length; i++) {
		var name = arr[i];
		let required = false;
		if (name.indexOf(":") != -1) {
			required = true;
			name = name.replace(/:/gi, '');
		}
		let rule = {
			rules: [{
				required: required,
				errorMessage: '请输入数据'
			}]
		};
		rules[name] = rule;
	}
	return rules;
}


export function getFormDataField(arr) {
	let fields = {};
	for (var i = 0; i < arr.length; i++) {
		var name = arr[i];
		if (name.indexOf(":") != -1) {
			name = name.replace(/:/gi, '');
		}
		fields[name] = "";
	}
	return fields;
}


export function distinctFun(arr, idName) {
	for (var i = 0; i < arr.length - 1; i++) {
		for (var j = i + 1; j < arr.length; j++) {
			if (arr[i][idName] == arr[j][idName]) {
				arr.splice(j, 1);
				//因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
				j--;
			}
		}
	}
	return arr;
}

export function randomString(len) {
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	var maxPos = $chars.length;
	var pwd = '';
	for (let i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

export function randomNum(minNum, maxNum) {
	switch (arguments.length) {
		case 1:
			return parseInt(Math.random() * minNum + 1, 10);
			break;
		case 2:
			return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
			//或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
			break;
		default:
			return 0;
			break;
	}
}


/**
 * 把平铺的数组结构转成树形结构
 */
// [
//   { 'id': '29', 'pid': '',     'name': '总裁办' },
//   { 'id': '2c', 'pid': '',     'name': '财务部' },
//   { 'id': '2d', 'pid': '2c',   'name': '财务核算部'},
//   { 'id': '2f', 'pid': '2c',   'name': '薪资管理部'},
//   { 'id': 'd2', 'pid': '',     'name': '技术部'},
//   { 'id': 'd3', 'pid': 'd2',   'name': 'Java研发部'}
// ]

/**
 * 把平铺的数组结构转成树形结构
 * @param list
 * @param childFiled
 * @param parentField
 * @returns {Array}
 */
export function tranListToTreeData(list, childFiled, parentField) {
	if (!childFiled) {
		childFiled = 'id'
	}
	if (!parentField) {
		parentField = 'pid'
	}
	const treeList = [],
		map = {}

	list.forEach(item => {
		if (!item.children) {
			item.children = []
		}
		map[item[childFiled]] = item
	})


	list.forEach(item => {

		const parent = map[item[parentField]]
		// 如果存在则表示item不是最顶层的数据
		if (parent) {
			parent.children.push(item)
		} else {
			// 如果不存在 则是顶层数据
			treeList.push(item)
		}
	})
	// 返回出去
	return treeList
}
