module.exports = [{
    "root": "pages",
    "pages": [
        {
            "path": "schedule/schedule",
            "style": {
                "navigationBarTitleText": "工作日程",
                "enablePullDownRefresh": false,
                "app-plus": {
                    "titleNView": {
                        "buttons": [
                            {
                                "text": "\ue468",
                                "fontSrc": "/static/uni.ttf",
                                "fontSize": "22px",
                                "color": "#FFFFFF"
                            },
                            {
                                "text": "",
                                "fontSize": "20",
                                "float": "left",
                                "color": "#fff"
                            },
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
            "path": "map/map",
            "style": {
                "navigationBarTitleText": "地图",
                "enablePullDownRefresh": false,
                "app-plus": {
                    "titleNView": {
                        "autoBackButton": false,
                        "buttons": [
                            {
                                "text": "放弃",
                                "color": "#fff",
                                "fontSize": "15px",
                                "fontWeight": "bold",
                                "float": "left"
                            },
                            {
                                "text": "完成",
                                "color": "#fff",
                                "fontSize": "15px",
                                "float": "right",
                                "fontWeight": "bold"
                            }
                        ]
                    }
                }
            }
        },


        {
            "path": "login/login",
            "style": {
                "navigationBarTitleText": "",
                "enablePullDownRefresh": false,
                "app-plus": {
                    "titleNView": false,
                    "bounce": "none",
                    "scrollIndicator": "none"
                }
            }
        },
        {
            "path": "index/index",
            "style": {
                "navigationBarTitleText": "uni-app"
            }
        },
        {
            "path": "mine/mine",
            "style": {
                "navigationBarTitleText": "个人中心",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "mine/password/password",
            "style": {
                "navigationBarTitleText": "修改密码",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "schedule/addSchedule",
            "style": {
                "navigationBarTitleText": "新增日程",
                "enablePullDownRefresh": false,
                "app-plus": {
                    "titleNView": {
                        "buttons": [
                            {
                                "text": "\ue60f",
                                "fontSrc": "/static/iconfont/iconfont.ttf",
                                "fontSize": "22px",
                                "color": "#FFFFFF"
                            }
                        ]
                    }
                }
            }
        },
        {
            "path": "schedule/updateSchedule",
            "style": {
                "navigationBarTitleText": "编辑日程",
                "enablePullDownRefresh": false,
                "app-plus": {
                    "titleNView": {
                        "buttons": [
                            {
                                "text": "\ue60f",
                                "fontSrc": "/static/iconfont/iconfont.ttf",
                                "fontSize": "22px",
                                "color": "#FFFFFF"
                            }
                        ]
                    }
                }
            }
        },
        {
            "path": "schedule/scheduleDetail",
            "style": {
                "navigationBarTitleText": "日程详情",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "schedule/scheduleSearch",
            "style": {
                "navigationBarTitleText": "",
                "enablePullDownRefresh": false,
                "app-plus": {
                    "titleNView": {
                        "buttons": [
                            {
                                "text": "",
                                "fontSrc": "/static/iconfont/iconfont.ttf",
                                "fontSize": "22px",
                                "color": "#FFFFFF"
                            }
                        ],
                        "searchInput": {
                            "align": "left",
                            "placeholder": "请输入查询内容",
                            "borderRadius": "13px",
                            "backgroundColor": "#F8F8F8"
                        }
                    }
                }
            }
        },
        {
            "path": "mine/message/message",
            "style": {
                "navigationBarTitleText": "消息列表",
                "enablePullDownRefresh": false,
                "app-plus": {
                    "titleNView": {
                        "buttons": [
                            {
                                "text": "\ue537",
                                "fontSrc": "/static/uni.ttf",
                                "fontSize": "22px",
                                "color": "#FFFFFF"
                            }
                        ],
                        "searchInput": {
                            "align": "left",
                            "placeholder": "请输入查询内容",
                            "borderRadius": "13px",
                            "backgroundColor": "#F8F8F8"
                        }
                    }
                }
            }
        },
        {
            "path": "backlog/backlog",
            "style": {
                "navigationBarTitleText": "待办",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "workbench/workbench",
            "style": {
                "navigationBarTitleText": "工作台",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "addressbook/addressbook",
            "style": {
                "navigationBarTitleText": "通信录",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "mine/message/messageDetail",
            "style": {
                "navigationBarTitleText": "新任务通知",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "backlog/backlogDetail",
            "style": {
                "navigationBarTitleText": "待办详情",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "addressbook/addressbookDetail",
            "style": {
                "navigationBarTitleText": "通讯录详情",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "preview/pdfView",
            "style": {
                "navigationBarTitleText": "文件预览",
                "enablePullDownRefresh": false
            }
        },


        {
            "path": "mine/aboutMe/aboutMe",
            "style": {
                "navigationBarTitleText": "",
                "enablePullDownRefresh": true
            }
        },
        {
            "path": "mine/aboutMe/privacyPolicyMe",
            "style": {
                "navigationBarTitleText": "隐私政策",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "audioView/audioView",
            "style": {
                "navigationBarTitleText": "音频播放",
                "enablePullDownRefresh": false
            }
        },
        {
            "path": "videoView/videoView",
            "style": {
                "navigationBarTitleText": "视频播放",
                "enablePullDownRefresh": false
            }
        }
    ]
}]
