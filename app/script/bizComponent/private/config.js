/**
 * @file 定增-配置文件
 * @author min.chen@joudou.com
 */

module.exports = {

    gradeField: [
        {
            text: '价格（A）',
            field: 'A'
        },
        {
            text: '大股东积极性（C）',
            field: 'C'
        },
        {
            text: '基本面（E）',
            field: 'E'
        }
    ],


    name: {
        major_biz: '主营业务',
        market_value: '市值',
        net_income: '净利润',
        PE: '市盈率（PE）',
        PB: '市净率（PB）'
    },


    gradeText: ['高', '较高', '中', '低'],

    category: ['', '定价', '不低于', '询价', '定价'],
    categoryTip: [
        '', '', '', 
        '因询价，此价格为当前日期前二十个交易日均价的90%（估）', 
        '因定价基准日未到，此价格为当前日期前二十个交易日均价的90%（估）'
    ]

}