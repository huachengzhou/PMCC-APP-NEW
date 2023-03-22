import Vue from 'vue';

import * as assessCommonUtils from "../assessCommonUtils.js";
var declareCommon = {};

/**
 * 空字符串检测
 * @param item
 * @returns {boolean}
 */
declareCommon.isNotBlank = function(item) {
	if (item) {
		return true;
	}
	return false;
};

declareCommon.isNotBlankObject = function(obj) {
	for (var key in obj) {
		return true;
	}
	return false
};

//来源 com.copower.pmcc.assess.common.enums.DeclareTypeEnum
declareCommon.masterData = "master"; //主数据
declareCommon.branchData = "branch"; //从数据

//土地
declareCommon.getLandColumn = function() {
	var cols = [];
	cols.push({
		field: 'autoInitNumber',
		title: '编号'
	});
	cols.push({
		field: 'regionsName',
		title: '区域'
	});
	cols.push({
		field: 'landCertName',
		title: '土地权证号'
	});
	cols.push({
		field: 'beLocated',
		title: '坐落'
	});
	cols.push({
		field: 'useRightArea',
		title: '使用权面积'
	});
	cols.push({
		field: 'landNumber',
		title: '地号'
	});
	cols.push({
		field: 'graphNumber',
		title: '图号'
	});
	return cols;
};



//房产
declareCommon.getHouseColumn = function() {
	var cols = [];
	cols.push({
		field: 'autoInitNumber',
		title: '编号'
	});
	cols.push({
		field: 'regionsName',
		title: '区域'
	});
	cols.push({
		field: 'certName',
		title: '房屋权证号'
	});
	cols.push({
		field: 'beLocated',
		title: '坐落'
	});
	cols.push({
		field: 'ownership',
		title: '房屋所有权人'
	});
	cols.push({
		field: 'floorArea',
		title: '建筑面积'
	});
	cols.push({
		field: 'planningUseName',
		title: '规划用途'
	});
	return cols;
};

//不动产
declareCommon.getRealEstateColumn = function() {
	var cols = [];
	cols.push({
		field: 'autoInitNumber',
		title: '编号'
	});
	cols.push({
		field: 'regionsName',
		title: '区域'
	});
	cols.push({
		field: 'certName',
		title: '不动产权证号'
	});
	cols.push({
		field: 'beLocated',
		title: '坐落'
	});
	cols.push({
		field: 'evidenceArea',
		title: '房屋证载面积'
	});
	return cols;
};
declareCommon.getRealEstateByLandColumn = function() {
	var cols = [];
	cols.push({
		field: 'autoInitNumber',
		title: '编号'
	});
	cols.push({
		field: 'provinceName',
		title: '区域',
		formatter: function(value, row, index) {
			return AssessCommon.getAreaFullName(row.provinceName, row.cityName, row.districtName);
		}
	});
	cols.push({
		field: 'certName',
		title: '不动产权证号'
	});
	cols.push({
		field: 'beLocated',
		title: '坐落'
	});
	cols.push({
		field: 'useRightArea',
		title: '共用宗地面积'
	});
	cols.push({
		field: 'acquisitionTypeName',
		title: '取得方式'
	});
	return cols;
};

//土建
declareCommon.getCivilEngineeringColumn = function() {
	var cols = [];
	cols.push({
		field: 'area',
		title: '区域',
		formatter: function(value, row, index) {
			return AssessCommon.getAreaFullName(row.provinceName, row.cityName, row.districtName);
		}
	});
	cols.push({
		field: 'name',
		title: '项目名称',
		visible: true
	});
	cols.push({
		field: 'bookNetValue',
		title: '帐面净值',
		visible: true
	});
	cols.push({
		field: 'bookValue',
		title: '帐面价值',
		visible: true
	});
	cols.push({
		field: 'declarer',
		title: '申报人'
	});
	cols.push({
		field: 'beLocated',
		title: '坐落'
	});
	cols.push({
		field: 'centerId',
		title: '中间表id',
		visible: false
	});
	cols.push({
		field: 'fileViewName',
		title: '附件'
	});
	return cols;
};

//设备安装
declareCommon.getEquipmentInstallationColumn = function() {
	var cols = [];
	cols.push({
		field: 'area',
		title: '区域',
		formatter: function(value, row, index) {
			return AssessCommon.getAreaFullName(row.provinceName, row.cityName, row.districtName);
		}
	});
	cols.push({
		field: 'bookEquipmentFee',
		title: '账面设备费',
		visible: false
	});
	cols.push({
		field: 'bookCapitalCost',
		title: '账面资金成本',
		visible: false
	});
	cols.push({
		field: 'bookInstallationFee',
		title: '账面安装费'
	});
	cols.push({
		field: 'declarer',
		title: '申报人'
	});
	cols.push({
		field: 'beLocated',
		title: '坐落'
	});
	cols.push({
		field: 'centerId',
		title: '中间表id',
		visible: true
	});
	cols.push({
		field: 'fileViewName',
		title: '附件'
	});
	return cols;
};

//权证号拼接
declareCommon.warrantJoin = function(data, param, callback) {
	if (!param) {
		return '';
	}
	var text = "";
	switch (param) {
		case "house": {
			if (declareCommon.isNotBlank(data.certName)) {
				return '';
			}
			var location = data.location;
			var number = data.number;
			var id = data.type;
			if (!declareCommon.isNotBlank(location)) {
				location = "";
			}
			if (!declareCommon.isNotBlank(number)) {
				number = "";
			}
			if (!declareCommon.isNotBlank(id)) {
				id = "";
			}
			if (id == "0") {
				text = location + "字第" + number + "号";
				return text;
			} else if (declareCommon.isNotBlank(id)) {
				assessCommonUtils.getDataDicInfo(id, function(data) {
					if (declareCommon.isNotBlank(data)) {
						text = location + data.name + "字第" + number + "号";
						callback(text);
					}
				});
			}
			break;
		}
		case "land": {
			var id = data.landRightType;
			var location = data.location;
			var year = data.year;
			if (year) {
				year = "(" + data.year + ")";
			}
			var number = data.number;
			if (!declareCommon.isNotBlank(number)) {
				number = "";
			} else {
				number = "第" + number + "号";
			}
			if (declareCommon.isNotBlank(id)) {
				assessCommonUtils.getDataDicInfo(id, function(item) {
					if (declareCommon.isNotBlank(item)) {
						text = location + item.name + year + number;
						callback(text);
					}
				});
			}
			break;
		}
		case "real": {
			var text = "";
			var province = data.provinceName;
			var provinceShort = assessCommonUtils.assessCommon.provinceForShort(province);
			var location = data.location;
			var number = data.number;
			var id = data.type;
			var year = data.year;
			if (year) {
				year = "(" + data.year + ")";
			}
			if (!declareCommon.isNotBlank(location)) {
				location = "";
			}
			if (!declareCommon.isNotBlank(number)) {
				number = "";
			}
			if (declareCommon.isNotBlank(location) && declareCommon.isNotBlank(number)) {
				text = provinceShort + year + location + "不动产权" + "第" + number + "号";
				callback(text);
			}
			break;
		}
		default: {
			break;
		}
	}
	return text;
};

//坐落拼接
declareCommon.seatJoin = function(data) {
	if (data.beLocated) {
		return '';
	}
	var text = "";
	// var district = data.district;
	var district = '';
	// var city = data.city;
	var city = '';
	var unit = data.unit;
	var floor = data.floor;
	var roomNumber = data.roomNumber;
	var streetNumber = data.streetNumber;
	var attachedNumber = data.attachedNumber;
	var buildingNumber = data.buildingNumber;
	if (declareCommon.isNotBlank(unit)) {
		unit = unit + "单元";
	} else {
		unit = "";
	}
	if (declareCommon.isNotBlank(floor)) {
		floor = floor + "层";
	} else {
		floor = "";
	}
	if (!declareCommon.isNotBlank(roomNumber)) {
		roomNumber = "";
	} else {
		roomNumber = roomNumber + "号";
	}
	if (!declareCommon.isNotBlank(streetNumber)) {
		streetNumber = "";
	}
	if (declareCommon.isNotBlank(attachedNumber)) {
		attachedNumber = "附" + attachedNumber + "号";
	} else {
		attachedNumber = "";
	}
	if (declareCommon.isNotBlank(buildingNumber)) {
		buildingNumber = buildingNumber + "栋";
	} else {
		buildingNumber = "";
	}
	text = (streetNumber + attachedNumber + buildingNumber + unit + floor + roomNumber).replace(/号+/, '号');
	if (declareCommon.isNotBlank(district)) {
		if (text.indexOf(district) < 0) {
			return district + text;
		}
	} else if (declareCommon.isNotBlank(city) && text.indexOf(city) < 0) {
		return city + text;
	}
	return text;
};



declareCommon.toDeclareRealtyCheckListDieldList = function() {
	let fieldList = [{
			label: "所在区",
			field: "district"
		},
		// {
		// 	label: "门牌号",
		// 	field: "houseNumber"
		// },
		{
			label: "街道",
			field: "streetNumber"
		},
		// {
		// 	label: "附号",
		// 	field: "attachedNumber"
		// },
		{
			label: "栋号",
			field: "buildingNumber"
		},
		// {
		// 	label: "单元",
		// 	field: "unit"
		// },
		// {
		// 	label: "楼层",
		// 	field: "floor"
		// },
		// {
		// 	label: "房号",
		// 	field: "roomNumber"
		// },
		{
			label: "用途",
			field: "certUse"
		},
		{
			label: "房屋建筑面积",
			field: "floorArea"
		},
		// {
		// 	label: "分摊面积",
		// 	field: "apportionmentArea"
		// },
		{
			label: "结构",
			field: "housingStructure"
		},
	];

	return fieldList;
};


export {
	declareCommon as declareCommon
};
