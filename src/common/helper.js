/* 帮助工具 */
import md5 from './md5.min.js';

/**
 * 判断数据类型
 * @param {any} val - 基本类型数据或者引用类型数据
 * @return {string} - 可能返回的结果有，均为小写字符串
 * number、boolean、string、null、undefined、array、object、function等
 */
function getType(val) {
	//判断数据是 null 和 undefined 的情况
	if (val == null) {
		return val + "";
	}
	return typeof(val) === "object" ?
		Object.prototype.toString.call(val).slice(8, -1).toLowerCase() :
		typeof(val);
}

export default {
	fetchLocalUser() {
		var user = {};
		try {
			user = uni.getStorageSync('userInfo') || {};
		} catch (e) {

		}

		return user;
	},
	getDate(type) {
		const date = new Date();

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;

		return `${year}-${month}-${day}`;
	},
	requestSign(data) {
		//用户信息
		var user = uni.getStorageSync('userInfo') || {};

		let str = ['appSecret=' + user.appToken];

		if(data) {
			
			let keys = Object.keys(data);
			keys.sort();
			
			keys.forEach(el => {
				//对象类型 
				if ((Object.prototype.toString.call(data[el]) === '[object Object]') || (Array.isArray(data[el]))) {
					str.push(el + '=' + JSON.stringify(data[el],function(key,value){
						// //值为空的属性去除
						if(value || value === 0){
							return value;
						}else{
							// console.log(key+":"+value);
							return undefined;
						}
						
					}));
				} else {
					//非对象类型 (当为null和undefined类型根本不会是number和boolean好处在这)
					//凡是以后再出现特殊类型  直接在switch添加单独处理
					let paramType = getType(data[el]);
					switch(paramType){
						case "number":{
							let strNum = data[el].toString() ;
							if(strNum){
								str.push(el + '=' + data[el]);
							}
							break;
						}
						case "boolean":{
							let strBoo = Boolean(data[el]).toString() ;
							if(strBoo){
								str.push(el + '=' + data[el]);
							}
							break;
						}
						default :{
							//由于boolean和数字已经处理了  所以这里放心大胆的处理
							if(data[el]){
							    str.push(el + '=' + data[el]);
							}
							break;
						}
					}
					// console.log(paramType) ;
				}
			})
		}
		var sing = md5(str.join('&'));
		return sing;
	}
}
