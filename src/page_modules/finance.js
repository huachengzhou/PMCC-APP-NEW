module.exports = [{
    "root": "pages/workbench/finance",
    "pages": [
        {
            "path": "expense/expense",
            "style": {
                "navigationBarTitleText": "报销发票",
                "enablePullDownRefresh": false,
                "app-plus": {
                    "titleNView": {
                        "buttons": [
                            {
                                "text": "\ue612",
                                "fontSrc": "/static/uni.ttf",
                                "fontSize": "22px",
                                "color": "#FFFFFF"
                            }
                        ]
                    }
                }
            }
        },
        {
            "path": "expense/expenseList",
            "style": {
                "navigationBarTitleText": "报销发票列表",
                "enablePullDownRefresh": false,
                "app-plus": {
                    "titleNView": {
                        "buttons": [
                            {
                                "text": "\ue466",
                                "fontSrc": "/static/uni.ttf",
                                "fontSize": "22px",
                                "color": "#FFFFFF"
                            }
                        ]
                    }
                }
            }
        },
        {
            "path": "expense/expenseDetail",
            "style": {
                "navigationBarTitleText": "报销发票详情",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "expense/expenseUpdate",
            "style": {
                "navigationBarTitleText": "报销发票修改",
                "enablePullDownRefresh": false,
                "app-plus": {
                    "titleNView": {
                        "buttons": [
                            {
                                "text": "\ue612",
                                "fontSrc": "/static/uni.ttf",
                                "fontSize": "22px",
                                "color": "#FFFFFF"
                            }
                        ]
                    }
                }
            }
        },
        {
            "path": "expensedetail/expenseDetailList",
            "style": {
                "navigationBarTitleText": "费用报销明细列表",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "expensedetail/expenseDetailAdd",
            "style": {
                "navigationBarTitleText": "新增费用报销明细",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "expensedetail/expenseDetailUpdate",
            "style": {
                "navigationBarTitleText": "修改费用报销明细",
                "enablePullDownRefresh": false
            }
        },
    ]
}]
