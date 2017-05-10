exports.mod = [
    '_stockinfogate_doumi_pool_dobet'
];

exports.res = {
    '_stockinfogate_doumi_pool_current': function() {
        return {
            "status": true,
            "data": {
                "pools": [{
                    "pool": {
                        "create_by": "lee",
                        "open_time": "2016-07-10T00:00:00Z",
                        "editor_option": null,
                        "settle_time": "2016-07-16T10:00:00Z",
                        "stop_time": "2016-07-16T00:00:00Z",
                        "amount1": 10,
                        "final_option": null,
                        "title": "明天大盘会不会涨?",
                        "amount2": 10,
                        "status": "open",
                        "id": 2,
                        "ext_info": null,
                        "option1": "上涨",
                        "option2": "下跌",
                        "option_special": null,
                        "created_at": "2016-07-28T03:48:16Z"
                    },
                    "doumi_available": 375,
                    "bets": [
                        // {
                        //     "uid": 880,
                        //     "poolid": 2,
                        //     "pooloption": 1,
                        //     "amount": 10
                        // }, {
                        //     "uid": 880,
                        //     "poolid": 2,
                        //     "pooloption": 1,
                        //     "amount": 10
                        // }
                    ],
                    "prev_option": 1,
                    "result": {
                        "id": 2,
                        "poolid": 2,
                        "uid": 886,
                        "iswin": 0,
                        "total_amount": 77,
                        "total_bet_times": 4,
                        "win_amount": 120,
                        "has_return_award": 1,
                        "created_at": "2016-07-29T07:18:05Z"
                    }
                }]
            }
        }
    },

    '_stockinfogate_doumi_pool_userpoolresult': function() {
        return {
            "status": true,
            "data": {
                "pool": {
                    "create_by": "lee",
                    "open_time": "2016-07-10T00:00:00Z",
                    "editor_option": null,
                    "settle_time": "2016-07-16T10:00:00Z",
                    "stop_time": "2016-07-16T00:00:00Z",
                    "amount1": 110,
                    "final_option": null,
                    "title": "明天大盘会不会涨?",
                    "amount2": 87,
                    "status": "settled",
                    "id": 2,
                    "ext_info": null,
                    "option1": "上涨",
                    "option2": "下跌",
                    "option_special": null,
                    "created_at": "2016-07-28T03:48:16Z"
                },
                "bets": [{
                    "uid": 886,
                    "poolid": 2,
                    "pooloption": 2,
                    "amount": 15
                }, {
                    "uid": 886,
                    "poolid": 2,
                    "pooloption": 2,
                    "amount": 35
                }, {
                    "uid": 886,
                    "poolid": 2,
                    "pooloption": 2,
                    "amount": 7
                }, {
                    "uid": 886,
                    "poolid": 2,
                    "pooloption": 2,
                    "amount": 20
                }],
                "doumi_available": 375,

                "result": {
                    "id": 2,
                    "poolid": 2,
                    "uid": 886,
                    "iswin": 1,
                    "total_amount": 77,
                    "total_bet_times": 4,
                    "win_amount": 120,
                    "has_return_award": 1,
                    "created_at": "2016-07-29T07:18:05Z"
                }
            }
        }
    },

    '_stockinfogate_doumi_pool_userpoolhistory': function() {
        return {
            "status": true,
            "uid": 889,
            "pools": {
                "1": {
                    "create_by": "lee",
                    "open_time": "2016-07-10T00:00:00Z",
                    "editor_option": null,
                    "settle_time": "2016-07-16T10:00:00Z",
                    "bets": [],
                    "stop_time": "2016-07-16T00:00:00Z",
                    "amount1": 10,
                    "final_option": null,
                    "title": "明天大盘会不会涨?",
                    "amount2": 10,
                    "status": "open",
                    "id": 1,
                    "ext_info": null,
                    "option1": "上涨",
                    "option2": "下跌",
                    "option_special": null,
                    "created_at": "2016-07-28T03:47:58Z"
                },
                "2": {
                    "create_by": "lee",
                    "open_time": "2016-07-10T00:00:00Z",
                    "editor_option": null,
                    "settle_time": "2016-07-16T10:00:00Z",
                    "bets": [{
                        "uid": 886,
                        "poolid": 2,
                        "pooloption": 2,
                        "amount": 15
                    }, {
                        "uid": 886,
                        "poolid": 2,
                        "pooloption": 2,
                        "amount": 35
                    }, {
                        "uid": 886,
                        "poolid": 2,
                        "pooloption": 2,
                        "amount": 7
                    }, {
                        "uid": 886,
                        "poolid": 2,
                        "pooloption": 2,
                        "amount": 20
                    }],
                    "stop_time": "2016-07-16T00:00:00Z",
                    "amount1": 110,
                    "final_option": null,
                    "title": "明天大盘会不会涨?",
                    "amount2": 87,
                    "status": "open",
                    "id": 2,
                    "ext_info": null,
                    "option1": "上涨",
                    "option2": "下跌",
                    "option_special": null,
                    "created_at": "2016-07-28T03:48:16Z",
                    "result": {
                        "id": 2,
                        "poolid": 2,
                        "uid": 886,
                        "iswin": 1,
                        "total_amount": 77,
                        "total_bet_times": 4,
                        "win_amount": 120,
                        "has_return_award": 1,
                        "created_at": "2016-07-29T07:18:05Z"
                    }
                },

                "3": {
                    "create_by": "lee",
                    "open_time": "2016-07-10T00:00:00Z",
                    "editor_option": null,
                    "settle_time": "2016-07-16T10:00:00Z",
                    "bets": [],
                    "stop_time": "2016-08-16T00:00:00Z",
                    "amount1": 110,
                    "final_option": null,
                    "title": "明天大盘会不会涨?",
                    "amount2": 87,
                    "status": "settled",
                    "id": 2,
                    "ext_info": null,
                    "option1": "上涨",
                    "option2": "下跌",
                    "option_special": null,
                    "created_at": "2016-07-28T03:48:16Z"
                },

                "4": {
                    "create_by": "lee",
                    "open_time": "2016-07-10T00:00:00Z",
                    "editor_option": null,
                    "settle_time": "2016-07-16T10:00:00Z",
                    "bets": [{
                        "uid": 886,
                        "poolid": 2,
                        "pooloption": 2,
                        "amount": 15
                    }, {
                        "uid": 886,
                        "poolid": 2,
                        "pooloption": 2,
                        "amount": 35
                    }, {
                        "uid": 886,
                        "poolid": 2,
                        "pooloption": 2,
                        "amount": 7
                    }, {
                        "uid": 886,
                        "poolid": 2,
                        "pooloption": 2,
                        "amount": 20
                    }],
                    "stop_time": "2016-08-16T00:00:00Z",
                    "amount1": 110,
                    "final_option": null,
                    "title": "明天大盘会不会涨?",
                    "amount2": 87,
                    "status": "settled",
                    "id": 2,
                    "ext_info": null,
                    "option1": "上涨",
                    "option2": "下跌",
                    "option_special": null,
                    "created_at": "2016-07-28T03:48:16Z"
                },

                "5": {
                    "create_by": "lee",
                    "open_time": "2016-07-10T00:00:00Z",
                    "editor_option": null,
                    "settle_time": "2016-07-16T10:00:00Z",
                    "bets": [{
                        "uid": 886,
                        "poolid": 2,
                        "pooloption": 2,
                        "amount": 15
                    }, {
                        "uid": 886,
                        "poolid": 2,
                        "pooloption": 2,
                        "amount": 35
                    }, {
                        "uid": 886,
                        "poolid": 2,
                        "pooloption": 2,
                        "amount": 7
                    }, {
                        "uid": 886,
                        "poolid": 2,
                        "pooloption": 2,
                        "amount": 20
                    }],
                    "stop_time": "2016-07-16T00:00:00Z",
                    "amount1": 110,
                    "final_option": null,
                    "title": "明天大盘会不会涨?",
                    "amount2": 87,
                    "status": "settled",
                    "id": 2,
                    "ext_info": null,
                    "option1": "上涨",
                    "option2": "下跌",
                    "option_special": null,
                    "created_at": "2016-07-28T03:48:16Z",
                    "result": {
                        "id": 2,
                        "poolid": 2,
                        "uid": 886,
                        "iswin": 0,
                        "total_amount": 77,
                        "total_bet_times": 4,
                        "win_amount": 120,
                        "has_return_award": 1,
                        "created_at": "2016-07-29T07:18:05Z"
                    }
                },
            }
        }
    }
}
