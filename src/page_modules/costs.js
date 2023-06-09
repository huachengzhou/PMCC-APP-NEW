module.exports = [{
    "root": "pages/workbench/costs",
    "pages": [
        {
            "path": "project/index",
            "style": {
                "navigationBarTitleText": "工程项目信息",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "project/imp/sceneSurveyPlanIndex/sceneSurveyPlanIndex",
            "style": {
                "navigationBarTitleText": "现场查勘计划",
                "enablePullDownRefresh": false,
                "app-plus": {
                    "titleNView": {
                        "buttons": [
                            {
                                "text": "\ue468",
                                "fontSrc": "/static/uni.ttf",
                                "fontSize": "22px"
                            }
                        ]
                    }
                }
            }
        },
        {
            "path": "project/imp/sceneSurveyPlanIndex/addSceneSurveyPlan",
            "style": {
                "navigationBarTitleText": "新增现场查勘",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "project/imp/sceneSurveyPlan/conductSelectiveExamination/conductSelectiveExamination",
            "style": {
                "navigationBarTitleText": "现场查勘",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "project/imp/sceneSurveyPlan/conductSelectiveExamination/conductSelectiveExaminationChild",
            "style": {
                "navigationBarTitleText": "现场查勘抽查点",
                "enablePullDownRefresh": false,
                "app-plus": {
                    "titleNView": {
                        "buttons": [
                            {
                                "text": "\ue468",
                                "fontSrc": "/static/uni.ttf",
                                "fontSize": "22px"
                            }
                        ]
                    }
                }
            }
        },
        {
            "path": "project/imp/sceneSurveyPlan/conductSelectiveExamination/conductSelectiveExaminationAddChild",
            "style": {
                "navigationBarTitleText": "新增现场查勘抽查点",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "project/details/details",
            "style": {
                "navigationBarTitleText": "工程事项任务",
                "enablePullDownRefresh": false
            }
        }
    ]
}]
