import Vue from 'vue';

import * as utils from "../untils.js";

import * as Explore from "./Explore.key.js";

const AssessDBKey = Explore.AssessDBKey;

var assessCommon = {};



function setProvinceListCommon(obj, name, callback) {
	let option = {
		url: `/app.assess/area/getProvinceList`,
		query: {},
		notParam: true,
		successCallback: function(resultData) {
			if (!resultData) {
				return false;
			}
			if (name) {
				obj[name] = resultData;
			}
			if (callback) {
				callback(resultData);
			}
		}
	};
	utils.requestDefault(option);
}


function setAreaListCommon(pid, obj, name, callback) {
	if (!pid) {
		return false;
	}
	let query = {
		pid: pid
	};
	let option = {
		url: `/app.assess/area/getAreaList` + "?" + utils.parseParam(query),
		query: query,
		notParam: true,
		successCallback: function(resultData) {
			if (!resultData) {
				return false;
			}
			if (name) {
				obj[name] = resultData;
			}
			if (callback) {
				callback(resultData);
			}
		}
	};
	utils.requestDefault(option);
}

function loadAsyncDataDicByKey(fieldName, callback, errorBack) {
	let query = {
		fieldName: fieldName
	};
	if (!errorBack) {
		errorBack = null;
	}
	let option = {
		url: `/app.assess/baseDataDic/getDataDicList` + "?" + utils.parseParam(query),
		query: query,
		notParam: true,
		successCallback: function(resultData) {
			if (callback) {
				callback(resultData);
			}
		},
		errorCallback: errorBack
	};
	utils.requestDefault(option);
}


function getAllChildDataDicList(fieldName, callback, errorBack) {
	let query = {
		fieldName: fieldName
	};
	if (!errorBack) {
		errorBack = null;
	}
	let option = {
		url: `/app.assess/baseDataDic/getAllChildDataDicList` + "?" + utils.parseParam(query),
		query: query,
		notParam: true,
		successCallback: function(resultData) {
			if (callback) {
				callback(resultData);
			}
		},
		errorCallback: errorBack
	};
	utils.requestDefault(option);
}


function getDataDicInfo(id, callback) {
	let query = {
		id: id
	};
	let option = {
		url: `/app.assess/baseDataDic/getBaseDataDic` + "?" + utils.parseParam(query),
		query: query,
		notParam: true,
		successCallback: function(resultData) {
			if (callback) {
				callback(resultData);
			}
		}
	};
	utils.requestDefault(option);
}

function getDataDicListByPid(pid, callback) {
	let query = {
		pid: pid
	};
	if (!pid) {
		return false;
	}
	let option = {
		url: `/app.assess/baseDataDic/getDataDicListByPid` + "?" + utils.parseParam(query),
		query: query,
		notParam: true,
		successCallback: function(resultData) {
			if (callback) {
				callback(resultData);
			}
		}
	};
	utils.requestDefault(option);
}

function getDataDicListByIds(arr, callback) {
	let id = "" ;
	if(utils.isArray(arr)){
		id = arr.join(",") ;
	}else {
		id = arr ;
	}
	let query = {
		id: id
	};
	if (!id) {
		return false;
	}
	let option = {
		url: `/app.assess/baseDataDic/getDataDicListByIds` + "?" + utils.parseParam(query),
		query: query,
		notParam: true,
		successCallback: function(resultData) {
			if (callback) {
				callback(resultData);
			}
		}
	};
	utils.requestDefault(option);
}

function checkboxTransformBaseDic(listData) {
	let arr = [];
	listData.forEach((item, index, array) => {
		arr.unshift({
			text: item.name,
			value: "" + item.id + "",
			id: item.id,
			name: item.name
		});
	});
	return arr;
}


function setProvinceList(obj, name, callback) {
	setProvinceListCommon(obj, name, callback);
}

function setAreaList(pid, obj, name, callback) {
	setAreaListCommon(pid, obj, name, callback);
}

assessCommon.isNotBlank = function(item) {
	if (item) {
		if (item == 'undefined') {
			return false;
		}
		return true;
	}
	return false;
};

assessCommon.getSysAreaDto = function(areaId, callback) {
	let query = {
		areaId: areaId
	};
	let option = {
		url: `/app.assess/area/getSysAreaDto` + "?" + utils.parseParam(query),
		query: query,
		notParam: true,
		successCallback: function(resultData) {
			if (callback) {
				callback(resultData);
			}
		}
	};
	utils.requestDefault(option);
};


assessCommon.provinceForShort = function(province) {
	if (province == "北京")
		return "京";
	else if (province == "天津")
		return "津";
	else if (province == "重庆")
		return "渝";
	else if (province == "上海")
		return "沪";
	else if (province == "河北")
		return "冀";
	else if (province == "山西")
		return "晋";
	else if (province == "辽宁")
		return "辽";
	else if (province == "吉林")
		return "吉";
	else if (province == "黑龙江")
		return "黑";
	else if (province == "江苏")
		return "苏";
	else if (province == "浙江")
		return "浙";
	else if (province == "安徽")
		return "皖";
	else if (province == "福建")
		return "闽";
	else if (province == "江西")
		return "赣";
	else if (province == "山东")
		return "鲁";
	else if (province == "河南")
		return "豫";
	else if (province == "湖北")
		return "鄂";
	else if (province == "湖南")
		return "湘";
	else if (province == "广东")
		return "粤";
	else if (province == "海南")
		return "琼";
	else if (province == "四川")
		return "川";
	else if (province == "贵州")
		return "黔";
	else if (province == "云南")
		return "云";
	else if (province == "陕西")
		return "陕";
	else if (province == "甘肃")
		return "甘";
	else if (province == "青海")
		return "青";
	else if (province == "台湾")
		return "台";
	else if (province == "内蒙古")
		return "内";
	else if (province == "广西")
		return "桂";
	else if (province == "宁夏")
		return "宁";
	else if (province == "新疆")
		return "新";
	else if (province == "西藏")
		return "藏";
	else if (province == "香港")
		return "港";
	else if (province == "澳门")
		return "澳";
	else
		return "";
};

var navigationCacheKey = function(id){
	return "assess_task_NavigationCache" + id;
} ;

export {
	navigationCacheKey,
	setProvinceList,
	setAreaList,
	setProvinceListCommon,
	setAreaListCommon,
	loadAsyncDataDicByKey,
	getAllChildDataDicList as loadAllChildDataDicList,
	getDataDicInfo,
	getDataDicListByPid,
	getDataDicListByIds,
	checkboxTransformBaseDic,
	assessCommon as assessCommon
};