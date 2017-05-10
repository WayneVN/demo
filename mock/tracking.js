exports.res = {
    // 获取标准化流水
    '_tally-api_unified-records': function() {
        return {
            status: true, //接口业务状态
            data: [ //输出结果按照date升序排序
                {
                    date: 1467273073, //业务发生时间
                    business: '买入', //业务类型
                    code: '002332.SZ', //股票代码
                    stock_name: '仙琚制药', //股票名称
                    price: 33.15, //交易价格
                    num: 200, //交易数量
                    amount: 33312.2, //发生金额
                    balance: 119932.8, //资金余额
                    calc_status: 0, //识别结果, 0-未计算, 1-识别成功
                }, {
                    date: 1467273073, //业务发生时间
                    business: '卖出', //业务类型
                    code: '002332.SZ', //股票代码
                    stock_name: '万达股份', //股票名称
                    price: 998, //交易价格
                    num: 2000, //交易数量
                    amount: 312.2, //发生金额
                    balance: 11009932.8, //资金余额
                    calc_status: 1, //识别结果, 0-未计算, 1-识别成功
                },
            ],
            page_size: 10,
            page_num: 1,
        };
    },

    /*   查询最新一次文件上传状态*/
    "_user-account_uploads-latest": function() {
        return {
            status: true,
            type: "latest",
            data: [ //输出结果按照upload_date降序排序
                {
                    ori_name: '好长的文件.xlsx', //原始文件名
                    upload_date: 1465273073, //上传日期
                    record_first_day: 1465273073, //交易最早日期
                    record_last_day: 1466273073, //交易最晚日期
                    upload_status: 1, //文件上传状态: 1-处理成功, 12-上传失败, 22-分析失败
                }, {
                    ori_name: '这是文件.xlsx', //原始文件名
                    upload_date: 1465273073, //上传日期
                    record_first_day: 1465273073, //交易最早日期
                    record_last_day: 1466273073, //交易最晚日期
                    upload_status: 22, //文件上传状态: 1-处理成功, 12-上传失败, 22-分析失败
                }, {
                    ori_name: '交易流水单交割.xlsx', //原始文件名
                    upload_date: 1465273073, //上传日期
                    record_first_day: 1465273073, //交易最早日期
                    record_last_day: 1466273073, //交易最晚日期
                    upload_status: 12, //文件上传状态: 1-处理成功, 12-上传失败, 22-分析失败
                },
            ]
        };
    },

    /*   所有文件上传状态*/
    "_user-account_uploads-history": function() {
        return {
            status: true,
            type: "history",
            data: [ //输出结果按照upload_date降序排序
                {
                    ori_name: 'history交易流水单交割.xlsx', //原始文件名
                    upload_date: 1465273073, //上传日期
                    record_first_day: 1465273073, //交易最早日期
                    record_last_day: 1466273073, //交易最晚日期
                    upload_status: 1, //文件上传状态: 1-处理成功, 12-上传失败, 22-分析失败
                },
            ]
        }
    },

    "_tally-api_user-period-profit-ratio": function() {
        return {
            "status": true,
            "data": {
                "month": [{
                    "date": 20160729,
                    "ratio": 0
                }, {
                    "date": 20160801,
                    "ratio": -0.0087111274488151
                }, {
                    "date": 20160802,
                    "ratio": -0.0027053318004653
                }, {
                    "date": 20160803,
                    "ratio": -0.00029469625945198
                }, {
                    "date": 20160804,
                    "ratio": 0.0010362366307585
                }, {
                    "date": 20160805,
                    "ratio": -0.00088697532486071
                }, {
                    "date": 20160808,
                    "ratio": 0.0083702800097793
                }, {
                    "date": 20160809,
                    "ratio": 0.015554357228523
                }, {
                    "date": 20160810,
                    "ratio": 0.013226793810761
                }, {
                    "date": 20160811,
                    "ratio": 0.0078201243846454
                }, {
                    "date": 20160812,
                    "ratio": 0.023941083840482
                }, {
                    "date": 20160815,
                    "ratio": 0.04895596298078
                }, {
                    "date": 20160816,
                    "ratio": 0.043868156249971
                }, {
                    "date": 20160817,
                    "ratio": 0.04370637538772
                }, {
                    "date": 20160818,
                    "ratio": 0.041880097691474
                }, {
                    "date": 20160819,
                    "ratio": 0.043218716850866
                }],
                "quarter": [{
                    "date": 20160630,
                    "ratio": 0
                }, {
                    "date": 20160701,
                    "ratio": 0.00097968815393829
                }, {
                    "date": 20160704,
                    "ratio": 0.020138648692553
                }, {
                    "date": 20160705,
                    "ratio": 0.026210421422924
                }, {
                    "date": 20160706,
                    "ratio": 0.029931229311849
                }, {
                    "date": 20160707,
                    "ratio": 0.029779092797369
                }, {
                    "date": 20160708,
                    "ratio": 0.019964529697631
                }, {
                    "date": 20160711,
                    "ratio": 0.022293443790064
                }, {
                    "date": 20160712,
                    "ratio": 0.040884443937285
                }, {
                    "date": 20160713,
                    "ratio": 0.044744451446145
                }, {
                    "date": 20160714,
                    "ratio": 0.04246731906618
                }, {
                    "date": 20160715,
                    "ratio": 0.042562144113797
                }, {
                    "date": 20160718,
                    "ratio": 0.038898954900313
                }, {
                    "date": 20160719,
                    "ratio": 0.036521023972612
                }, {
                    "date": 20160720,
                    "ratio": 0.033551887204479
                }, {
                    "date": 20160721,
                    "ratio": 0.037344069886265
                }, {
                    "date": 20160722,
                    "ratio": 0.028403139712624
                }, {
                    "date": 20160725,
                    "ratio": 0.029431298553249
                }, {
                    "date": 20160726,
                    "ratio": 0.041152432219803
                }, {
                    "date": 20160727,
                    "ratio": 0.021297541850086
                }, {
                    "date": 20160728,
                    "ratio": 0.022090925068858
                }, {
                    "date": 20160729,
                    "ratio": 0.016976038789111
                }, {
                    "date": 20160801,
                    "ratio": 0.0081170309028277
                }, {
                    "date": 20160802,
                    "ratio": 0.014224781171063
                }, {
                    "date": 20160803,
                    "ratio": 0.016676339754527
                }, {
                    "date": 20160804,
                    "ratio": 0.018029866613108
                }, {
                    "date": 20160805,
                    "ratio": 0.01607400613673
                }, {
                    "date": 20160808,
                    "ratio": 0.025488412997012
                }, {
                    "date": 20160809,
                    "ratio": 0.032794447389285
                }, {
                    "date": 20160810,
                    "ratio": 0.030427371164659
                }, {
                    "date": 20160811,
                    "ratio": 0.024928917908646
                }, {
                    "date": 20160812,
                    "ratio": 0.041323547397522
                }, {
                    "date": 20160815,
                    "ratio": 0.06676308009641
                }, {
                    "date": 20160816,
                    "ratio": 0.061588902561188
                }, {
                    "date": 20160817,
                    "ratio": 0.061424375300744
                }, {
                    "date": 20160818,
                    "ratio": 0.059567094643487
                }, {
                    "date": 20160819,
                    "ratio": 0.060928438253653
                }],
                "year": [{
                    "date": 20151231,
                    "ratio": 0
                }, {
                    "date": 20160104,
                    "ratio": -0.068638376569455
                }, {
                    "date": 20160105,
                    "ratio": -0.071053539237415
                }, {
                    "date": 20160106,
                    "ratio": -0.050108048981602
                }, {
                    "date": 20160107,
                    "ratio": -0.11702715816895
                }, {
                    "date": 20160108,
                    "ratio": -0.099675549312682
                }, {
                    "date": 20160111,
                    "ratio": -0.14762680041961
                }, {
                    "date": 20160112,
                    "ratio": -0.14588704807741
                }, {
                    "date": 20160113,
                    "ratio": -0.16658796203722
                }, {
                    "date": 20160114,
                    "ratio": -0.1501852730429
                }, {
                    "date": 20160115,
                    "ratio": -0.18032757796371
                }, {
                    "date": 20160118,
                    "ratio": -0.17669202026604
                }, {
                    "date": 20160119,
                    "ratio": -0.15015973041679
                }, {
                    "date": 20160120,
                    "ratio": -0.1589316728818
                }, {
                    "date": 20160121,
                    "ratio": -0.18611654292197
                }, {
                    "date": 20160122,
                    "ratio": -0.17592187053172
                }, {
                    "date": 20160125,
                    "ratio": -0.16971916588972
                }, {
                    "date": 20160126,
                    "ratio": -0.22304490763812
                }, {
                    "date": 20160127,
                    "ratio": -0.22706493271793
                }, {
                    "date": 20160128,
                    "ratio": -0.24963989559282
                }, {
                    "date": 20160129,
                    "ratio": -0.22648801973134
                }, {
                    "date": 20160201,
                    "ratio": -0.24026125924751
                }, {
                    "date": 20160202,
                    "ratio": -0.22310568439559
                }, {
                    "date": 20160203,
                    "ratio": -0.2260225731828
                }, {
                    "date": 20160204,
                    "ratio": -0.21421877185798
                }, {
                    "date": 20160205,
                    "ratio": -0.21917209171984
                }, {
                    "date": 20160215,
                    "ratio": -0.22405915333145
                }, {
                    "date": 20160216,
                    "ratio": -0.19852367576812
                }, {
                    "date": 20160217,
                    "ratio": -0.18983031078453
                }, {
                    "date": 20160218,
                    "ratio": -0.19108630726214
                }, {
                    "date": 20160219,
                    "ratio": -0.19189776597806
                }, {
                    "date": 20160222,
                    "ratio": -0.17292326794506
                }, {
                    "date": 20160223,
                    "ratio": -0.17966033336687
                }, {
                    "date": 20160224,
                    "ratio": -0.17243699737501
                }, {
                    "date": 20160225,
                    "ratio": -0.22545789466204
                }, {
                    "date": 20160226,
                    "ratio": -0.21812165122115
                }, {
                    "date": 20160229,
                    "ratio": -0.24050843501432
                }, {
                    "date": 20160301,
                    "ratio": -0.22773960841063
                }, {
                    "date": 20160302,
                    "ratio": -0.1948192603494
                }, {
                    "date": 20160303,
                    "ratio": -0.19197196391629
                }, {
                    "date": 20160304,
                    "ratio": -0.18790644809751
                }, {
                    "date": 20160307,
                    "ratio": -0.18135332348982
                }, {
                    "date": 20160308,
                    "ratio": -0.18020969761402
                }, {
                    "date": 20160309,
                    "ratio": -0.19118144224234
                }, {
                    "date": 20160310,
                    "ratio": -0.20752151789655
                }, {
                    "date": 20160311,
                    "ratio": -0.20594434549973
                }, {
                    "date": 20160314,
                    "ratio": -0.19204520118053
                }, {
                    "date": 20160315,
                    "ratio": -0.19066934649502
                }, {
                    "date": 20160316,
                    "ratio": -0.18895663430015
                }, {
                    "date": 20160317,
                    "ratio": -0.17923633707553
                }, {
                    "date": 20160318,
                    "ratio": -0.16501895536932
                }, {
                    "date": 20160321,
                    "ratio": -0.14703403631218
                }, {
                    "date": 20160322,
                    "ratio": -0.15252652032381
                }, {
                    "date": 20160323,
                    "ratio": -0.14953215600475
                }, {
                    "date": 20160324,
                    "ratio": -0.16337433800732
                }, {
                    "date": 20160325,
                    "ratio": -0.15815734139011
                }, {
                    "date": 20160328,
                    "ratio": -0.16426448722514
                }, {
                    "date": 20160329,
                    "ratio": -0.17499809772422
                }, {
                    "date": 20160330,
                    "ratio": -0.15216426146393
                }, {
                    "date": 20160331,
                    "ratio": -0.15124023436038
                }, {
                    "date": 20160401,
                    "ratio": -0.14965382254018
                }, {
                    "date": 20160405,
                    "ratio": -0.13735278765977
                }, {
                    "date": 20160406,
                    "ratio": -0.13805164973295
                }, {
                    "date": 20160407,
                    "ratio": -0.14996739783282
                }, {
                    "date": 20160408,
                    "ratio": -0.15659655696137
                }, {
                    "date": 20160411,
                    "ratio": -0.14275188850847
                }, {
                    "date": 20160412,
                    "ratio": -0.14566516064066
                }, {
                    "date": 20160413,
                    "ratio": -0.13351780534366
                }, {
                    "date": 20160414,
                    "ratio": -0.12907514021814
                }, {
                    "date": 20160415,
                    "ratio": -0.13027454169564
                }, {
                    "date": 20160418,
                    "ratio": -0.14283569318661
                }, {
                    "date": 20160419,
                    "ratio": -0.14024673329167
                }, {
                    "date": 20160420,
                    "ratio": -0.16009298646108
                }, {
                    "date": 20160421,
                    "ratio": -0.16565715370549
                }, {
                    "date": 20160422,
                    "ratio": -0.1638632645584
                }, {
                    "date": 20160425,
                    "ratio": -0.16741481979211
                }, {
                    "date": 20160426,
                    "ratio": -0.16232061991501
                }, {
                    "date": 20160427,
                    "ratio": -0.16543682030019
                }, {
                    "date": 20160428,
                    "ratio": -0.16772048365189
                }, {
                    "date": 20160429,
                    "ratio": -0.16977324618438
                }, {
                    "date": 20160503,
                    "ratio": -0.15442515119101
                }, {
                    "date": 20160504,
                    "ratio": -0.15481255710536
                }, {
                    "date": 20160505,
                    "ratio": -0.15295633716933
                }, {
                    "date": 20160506,
                    "ratio": -0.1768584711625
                }, {
                    "date": 20160509,
                    "ratio": -0.19978328890075
                }, {
                    "date": 20160510,
                    "ratio": -0.19964803165387
                }, {
                    "date": 20160511,
                    "ratio": -0.19839180913533
                }, {
                    "date": 20160512,
                    "ratio": -0.19872391978496
                }, {
                    "date": 20160513,
                    "ratio": -0.20119711846402
                }, {
                    "date": 20160516,
                    "ratio": -0.19448568043366
                }, {
                    "date": 20160517,
                    "ratio": -0.19651371973845
                }, {
                    "date": 20160518,
                    "ratio": -0.2067335956934
                }, {
                    "date": 20160519,
                    "ratio": -0.20690538680705
                }, {
                    "date": 20160520,
                    "ratio": -0.20165643365208
                }, {
                    "date": 20160523,
                    "ratio": -0.19652476748935
                }, {
                    "date": 20160524,
                    "ratio": -0.20273487497209
                }, {
                    "date": 20160525,
                    "ratio": -0.20459406169544
                }, {
                    "date": 20160526,
                    "ratio": -0.20251544573055
                }, {
                    "date": 20160527,
                    "ratio": -0.20291014146518
                }, {
                    "date": 20160530,
                    "ratio": -0.20251318532116
                }, {
                    "date": 20160531,
                    "ratio": -0.1759067257888
                }, {
                    "date": 20160601,
                    "ratio": -0.17678497960221
                }, {
                    "date": 20160602,
                    "ratio": -0.17347302776385
                }, {
                    "date": 20160603,
                    "ratio": -0.16967195158859
                }, {
                    "date": 20160606,
                    "ratio": -0.17096719442423
                }, {
                    "date": 20160607,
                    "ratio": -0.17041706728891
                }, {
                    "date": 20160608,
                    "ratio": -0.17292778876384
                }, {
                    "date": 20160613,
                    "ratio": -0.19951254836605
                }, {
                    "date": 20160614,
                    "ratio": -0.19693627501881
                }, {
                    "date": 20160615,
                    "ratio": -0.18421539734931
                }, {
                    "date": 20160616,
                    "ratio": -0.18828229766885
                }, {
                    "date": 20160617,
                    "ratio": -0.1848101958252
                }, {
                    "date": 20160620,
                    "ratio": -0.18376359802247
                }, {
                    "date": 20160621,
                    "ratio": -0.1866601996354
                }, {
                    "date": 20160622,
                    "ratio": -0.17903357835323
                }, {
                    "date": 20160623,
                    "ratio": -0.18287325101883
                }, {
                    "date": 20160624,
                    "ratio": -0.19351802742888
                }, {
                    "date": 20160627,
                    "ratio": -0.18181563372032
                }, {
                    "date": 20160628,
                    "ratio": -0.17705348798263
                }, {
                    "date": 20160629,
                    "ratio": -0.1716751546452
                }, {
                    "date": 20160630,
                    "ratio": -0.172236470807
                }, {
                    "date": 20160701,
                    "ratio": -0.17142552068318
                }, {
                    "date": 20160704,
                    "ratio": -0.15556643189207
                }, {
                    "date": 20160705,
                    "ratio": -0.15054043986832
                }, {
                    "date": 20160706,
                    "ratio": -0.14746049079874
                }, {
                    "date": 20160707,
                    "ratio": -0.14758642385688
                }, {
                    "date": 20160708,
                    "ratio": -0.15571056124581
                }, {
                    "date": 20160711,
                    "ratio": -0.15378277109747
                }, {
                    "date": 20160712,
                    "ratio": -0.13839381920438
                }, {
                    "date": 20160713,
                    "ratio": -0.13519864576613
                }, {
                    "date": 20160714,
                    "ratio": -0.13708357290141
                }, {
                    "date": 20160715,
                    "ratio": -0.13700508018534
                }, {
                    "date": 20160718,
                    "ratio": -0.14003733461679
                }, {
                    "date": 20160719,
                    "ratio": -0.14200569911368
                }, {
                    "date": 20160720,
                    "ratio": -0.14446344224353
                }, {
                    "date": 20160721,
                    "ratio": -0.14132441172351
                }, {
                    "date": 20160722,
                    "ratio": -0.14872538763831
                }, {
                    "date": 20160725,
                    "ratio": -0.14787431524783
                }, {
                    "date": 20160726,
                    "ratio": -0.13817198827786
                }, {
                    "date": 20160727,
                    "ratio": -0.15460714240203
                }, {
                    "date": 20160728,
                    "ratio": -0.15395040870886
                }, {
                    "date": 20160729,
                    "ratio": -0.1581843250272
                }, {
                    "date": 20160801,
                    "ratio": -0.1655174886603
                }, {
                    "date": 20160802,
                    "ratio": -0.16046171574284
                }, {
                    "date": 20160803,
                    "ratio": -0.15843240495777
                }, {
                    "date": 20160804,
                    "ratio": -0.15731200478845
                }, {
                    "date": 20160805,
                    "ratio": -0.15893099475899
                }, {
                    "date": 20160808,
                    "ratio": -0.15113809211106
                }, {
                    "date": 20160809,
                    "ratio": -0.14509042329811
                }, {
                    "date": 20160810,
                    "ratio": -0.14704980266767
                }, {
                    "date": 20160811,
                    "ratio": -0.15160122173997
                }, {
                    "date": 20160812,
                    "ratio": -0.13803034537445
                }, {
                    "date": 20160815,
                    "ratio": -0.1169724280066
                }, {
                    "date": 20160816,
                    "ratio": -0.12125542346382
                }, {
                    "date": 20160817,
                    "ratio": -0.12139161312958
                }, {
                    "date": 20160818,
                    "ratio": -0.12292900232113
                }, {
                    "date": 20160819,
                    "ratio": -0.12180213172993
                }]
            },
            "type": "index",
            "code": "000001.SH",
            "uid": 1815,
            "aid": 2717
        };
    },


  "_tally-api_transaction-summary": function() {
    var list = [];
    for(var i = 10; i <= 30; i++) {
      list.push({
        "date": '201508' + i, //日期
        "counter_fee": 10*i, //今日交易费用
        "bought_value": 200*i, //今日买入市值
        "sold_value": 100*i, //今日卖出市值
        "net_value": 111*i, //今日净资产
      });
    }

    return {
      status: true,
      /* data: {
       *   counter_fee: 1234, //手续费
       *   annual_turnover_rate: 15, //年化换手率
       * }*/
      data: list
    };
  },

  "_tally-api_user-accumulative-profit": function() {
    return {
      "status": true,
      "data": {
        "accumulative_profit": 543667.5625,
        "accumulative_profit_ratio": 2.1608501706484,
        "multiply_profit_ratio": 2.1086036134253,
        "profit_ranking": 0.95143911439114,
        "profit_ratio_ranking": 0.97881918819188,
        "multiply_ratio_ranking": 0.97261992619926
      },
      "uid": 215,
      "aid": 889
    }
  },

    "_tally-api_transaction-summary": function() {
        var list = [];
        for (var i = 10; i <= 30; i++) {
            list.push({
                "date": '201508' + i, //日期
                "counter_fee": 10 * i, //今日交易费用
                "bought_value": 200 * i, //今日买入市值
                "sold_value": 100 * i, //今日卖出市值
                "net_value": 111 * i, //今日净资产
            });
        }

        return {
            status: true,
            /* data: {
             *   counter_fee: 1234, //手续费
             *   annual_turnover_rate: 15, //年化换手率
             * }*/
            data: list
        };
    },

    "_tally-api_record-info": function() {
        return {
            "status": true,
            "uid": 912,
            "aid": 1520,
            "record": {
                "upload_first_day": "20160728",
                "upload_last_day": "20160728",
                "record_first_day": "20150722",
                "record_last_day": "20160727"
            }
        };
    },
    "_tally-api_get-settings": function() {
        return {
            status: 1,
            data: {
                cal_type: 1,
                rank_type: 1
            }
        }
    },

    "_tally-api_user-position-dist": function() {
        return {
            "uid": "uid",
            "status": true,
            "position": [{
                    "code": "002038.sz",
                    "name": "万达集团",
                    "value": 4,
                    sector: 1,
                    's_type': 'stock'
                }, //sector: 1-主板,2-中小板,6-创业板
                {
                    "code": "002038.sz",
                    "name": "万达集团",
                    "value": 1,
                    sector: 1,
                    's_type': 'cash'
                }, {
                    "code": "002038.sz",
                    "name": "万达集团",
                    "value": 1,
                    sector: 1,
                    's_type': 'stock'
                }, {
                    "code": "002000.sz",
                    "name": "阿里巴巴",
                    "value": 1,
                    sector: 1,
                    's_type': 'fund'
                }, {
                    "code": "002000.sz",
                    "name": "阿里巴巴",
                    "value": 1,
                    sector: 1,
                    's_type': 'fund'
                }, {
                    "code": "002000.sz",
                    "name": "阿里巴巴",
                    "value": 1,
                    sector: 1,
                    's_type': 'cash'
                }, {
                    "code": "001038.sz",
                    "name": "xx集团",
                    "value": 1,
                    sector: 1,
                    's_type': 'bond'
                }, {
                    "code": "001038.sz",
                    "name": "xx集团",
                    "value": 1,
                    sector: 1,
                    's_type': 'bond'
                }, {
                    "code": "001038.sz",
                    "name": "xx集团",
                    "value": 1,
                    sector: 1,
                    's_type': 'cash'
                }, {
                    "code": "001038.sz",
                    "name": "xx集团",
                    "value": 1,
                    sector: 1,
                    's_type': 'cash'
                },
            ],
        }
    },

    "_tally-api_get-settings": function() {
        return {
            status: 1,
            data: {
                cal_type: 0,
                rank_type: 1
            }
        }
    },

    "_tally-api_set-settings": function() {
        return {
            status: 1
        }
    },

    "_tally-api_user-income-sums": function() {
        return {
            "data": {
                "start": 0, //起始日期, 0表示不限制
                "end": 0, //结束日期, 0表示不限制
                "values": [{
                    "earn": 142.55, //盈亏值
                    "clear_date": 20150812, //清仓日期
                    "build_date": 20160108,
                    "buy": 1916.0400390625,
                    "parent_fund_id": null,
                    "stock_id": "000002.sz",
                    "stock_name": "万科A"
                }, {
                    "earn": 142.55, //盈亏值
                    "clear_date": 20150812, //清仓日期
                    "build_date": 20160108,
                    "buy": 1916.0400390625,
                    "parent_fund_id": null,
                    "stock_id": "000002.sz",
                    "stock_name": "万科A"
                }, {
                    "earn": 142.55, //盈亏值
                    "clear_date": 20150812, //清仓日期
                    "build_date": 20160108,
                    "buy": 1916.0400390625,
                    "parent_fund_id": null,
                    "stock_id": "000002.sz",
                    "stock_name": "万科A"
                }, {
                    "earn": 142.55, //盈亏值
                    "clear_date": 20150812, //清仓日期
                    "build_date": 20160108,
                    "buy": 1916.0400390625,
                    "parent_fund_id": null,
                    "stock_id": "000002.sz",
                    "stock_name": "万科A"
                }, {
                    "earn": 142.55, //盈亏值
                    "clear_date": 20150812, //清仓日期
                    "build_date": 20160108,
                    "buy": 1916.0400390625,
                    "parent_fund_id": null,
                    "stock_id": "000002.sz",
                    "stock_name": "万科A"
                }, {
                    "earn": 142.55, //盈亏值
                    "clear_date": 20150812, //清仓日期
                    "build_date": 20160108,
                    "buy": 1916.0400390625,
                    "parent_fund_id": null,
                    "stock_id": "000002.sz",
                    "stock_name": "万科A"
                }, {
                    "earn": 142.55, //盈亏值
                    "clear_date": 20150812, //清仓日期
                    "build_date": 20160108,
                    "buy": 1916.0400390625,
                    "parent_fund_id": null,
                    "stock_id": "000002.sz",
                    "stock_name": "万科A"
                }, {
                    "earn": 142.55, //盈亏值
                    "clear_date": 20150812, //清仓日期
                    "build_date": 20160108,
                    "buy": 1916.0400390625,
                    "parent_fund_id": null,
                    "stock_id": "000002.sz",
                    "stock_name": "万科A"
                }, {
                    "earn": 142.55, //盈亏值
                    "clear_date": 20150812, //清仓日期
                    "build_date": 20160108,
                    "buy": 1916.0400390625,
                    "parent_fund_id": null,
                    "stock_id": "000002.sz",
                    "stock_name": "万科A"
                }, ]
            },
            "user_id": 1,
            "account_id": {
                "atype": "sub",
                "aid": 2230
            }
        };
    },

    "_record_history-status": function() {
        return {
            "status": true,
            "type": "history",
            "data": [{
                "fid": "16588",
                "upload_status": "1",
                "st_col_num": "7",
                "ori_name": "275_none_y8lzPCSr6lwTJcuUFHEbop--hYAzYAER.xls",
                "upload_date": "20160922",
                "record_first_day": "20141126",
                "record_last_day": "20151118",
                "multiple_mapping": {
                    "business": ["买卖标志", "备注"],
                    "num": ["成交数量", "证券数量"],
                    "amount": ["发生金额", "成交金额"]
                }
            }, {
                "fid": "16588",
                "upload_status": "1",
                "st_col_num": "7",
                "ori_name": "275_none_y8lzPCSr6lwTJcuUFHEbop--hYAzYAER.xls",
                "upload_date": "20160922",
                "record_first_day": "20141126",
                "record_last_day": "20151118",
                "multiple_mapping": {
                    "business": ["买卖标志", "备注"],
                    "num": ["成交数量", "证券数量"],
                    "amount": ["发生金额", "成交金额"]
                }
            }]
        };
    },

}
