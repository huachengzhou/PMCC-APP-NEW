import Vue from 'vue';

import * as utils from '../../untils.js';
import * as examineCommon from './examine.common.js';
import * as Explore from '../Explore.key.js';


function setProvinceList(obj, name ,callback) {
	examineCommon.setProvinceListCommon(obj, name , callback);
}

function setAreaList(pid, obj, name , callback) {
	examineCommon.setAreaListCommon(pid, obj, name , callback);
}

function getBasicEstateLandStateByEstateId(estateId, callback) {
	let query = {
		estateId: estateId
	};
	let option = {
		url: `/app.assess/basicEstateLandState/getByEstateId` + "?" + utils.parseParam(query),
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



export {
	setProvinceList,
	setAreaList,
	getBasicEstateLandStateByEstateId
};
