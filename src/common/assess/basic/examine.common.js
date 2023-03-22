import Vue from 'vue';

import * as utils from '../../untils.js';

import * as Explore from '../Explore.key.js';

const AssessDBKey = Explore.AssessDBKey;

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

function checkboxTransformBaseDic(listData) {
	let arr = [];
	listData.forEach((item, index, array) => {
		arr.push({
			text: item.name,
			value: "" + item.id + "",
			id: item.id,
			name: item.name
		});
	});
	return arr;
}

function getBasicgetNodeByFormData(tableId, formClassify, callback) {
	let query = {
		tableId: tableId,
		formClassify: formClassify
	};
	let option = {
		url: "/app.assess/basicApplyBatchDetail/getNodeByFormData?" + utils.parseParam(query),
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


function getBasicCheckWriteContent(applyBatchId, userAccount, callback) {
	let query = {
		applyBatchId: applyBatchId,
		userAccount: userAccount
	};
	let option = {
		url: "/app.assess/basicApplyBatch/checkWriteContent?" + utils.parseParam(query),
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

function runBasicCheckWriteContent(applyBatchId,userInfo,data,name) {
	if(!name){
		name = "commitFlag" ;
	}
	if(! applyBatchId){
		return false ;
	}
	getBasicCheckWriteContent(applyBatchId,userInfo.userAccount,function(item){
		data[name] = item;
		// data[name] = true;
		console.log("提交"+item);
	});
}

function getBasicEstateTaggingDtoListByWhere(query, callback) {
	let url = "/app.assess/basicEstateTagging/getBasicEstateTaggingDtoListByWhere";
	let option = {
		query: query,
		url: url + "?" + utils.parseParam(query),
		successCallback: function(resultData) {
			if (callback) {
				callback(resultData);
			}
		}
	};
	utils.requestDefault(option);
}


function getBuilderEstateStreetInfoList(batchDetail, callback) {
	let url = "/app.assess/basic/public/getEstateStreetInfoList";
	let query = {
		resultTableName: AssessDBKey.BasicEstate,
		tableId: batchDetail.tableId,
		tableName: batchDetail.tableName
	};
	let option = {
		query: query,
		url: url + "?" + utils.parseParam(query),
		successCallback: function(resultData) {
			if (callback) {
				callback(resultData);
			}
		}
	};
	utils.requestDefault(option);
}

function getUnitPropertiesList(callback) {
	let url = "/app.assess/public/getUnitPropertiesList";
	let query = {};
	let option = {
		query: query,
		url: url + "?" + utils.parseParam(query),
		successCallback: function(resultData) {
			if (callback) {
				callback(resultData);
			}
		}
	};
	utils.requestDefault(option);
}


function getBuildingNewRateList(callback) {
	let url = "/app.assess/public/getAssessBuildingNewRateList";
	let query = {};
	let option = {
		query: query,
		url: url + "?" + utils.parseParam(query),
		successCallback: function(resultData) {
			if (callback) {
				callback(resultData);
			}
		}
	};
	utils.requestDefault(option);
}


//tableId  num
function getPrevMapCenter(tableId, num, callback) {
	let resultTableName = "";
	let tableName = "";
	let type = "";
	if (num == 2) {
		resultTableName = AssessDBKey.BasicEstate;
		tableName = AssessDBKey.BasicBuilding;
		type = "estate";
	}
	if (num == 3) {
		resultTableName = AssessDBKey.BasicEstate;
		tableName = AssessDBKey.BasicUnit;
		type = "estate";
	}
	new Promise(function(resolve, reject) {
		let option = {
			query: {
				tableId: tableId,
				tableName: tableName,
				resultTableName: resultTableName
			},
			url: "/app.assess/basicApplyBatchDetail/getSpecifyNodeData",
			successCallback: function(resultData) {
				resolve(resultData);
			}
		};
		utils.requestDefault(option);
	}).then(nodeData => {
		let query = {
			tableId: nodeData.tableId,
			type: type
		};
		return new Promise(function(resolve, reject) {
			let option = {
				notParam: true,
				query: query,
				url: "/app.assess/basicEstateTagging/getApplyBatchEstateTaggingsByTableId?" + utils
					.parseParam(query),
				successCallback: function(resultData) {
					resolve(resultData);
				}
			};
			utils.requestDefault(option);
		});
	}).then(res => {
		if(callback){
			callback(res) ;
		}
	});
}

var runBasicCheckWriteTitle = "当前表单完成或者登陆人无权限修改" ;

var homeHandleTitle = "主页面操作" ;

var childNavigationCacheKey = function(id){
	return "assess_basic_childNavigationCache" + id;
} ;

export {
	setProvinceListCommon,
	setAreaListCommon,
	loadAsyncDataDicByKey,
	getDataDicInfo,
	getDataDicListByPid,
	checkboxTransformBaseDic,
	getBasicgetNodeByFormData,
	getBasicEstateTaggingDtoListByWhere,
	getUnitPropertiesList,
	getBuilderEstateStreetInfoList,
	getBuildingNewRateList,
	getPrevMapCenter,
	getBasicCheckWriteContent,
	runBasicCheckWriteContent,
	runBasicCheckWriteTitle,
	homeHandleTitle,
	childNavigationCacheKey
};
