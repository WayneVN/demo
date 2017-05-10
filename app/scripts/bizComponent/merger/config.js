/**
 * @file 并购-配置文件
 * @author min.chen@joudou.com
 */

module.exports = {


    gradeText: ['高', '较高', '中', '低'],
    priceType: {
        '1': '定价',
        '2': '不低于',
        '3': '询价',
        '4': '定价'
    },

    categoryTip: [
        '', '', '', '',
        '因定价基准日未到，此价格为当前日期前二十个交易日均价的90%（估）'
    ],

    blockHeight: 80,

    gradeField: [
        {
            text: '估值（A）',
            field: 'Growth'
        },
        {
            text: '价格（B）',
            field: 'Price'
        },
        {
            text: '积极性（C）',
            field: 'Activism'
        },
        {
            text: '概念（D）',
            field: 'Concept'
        }
    ],

    gradeConcept: [
        {
            grade: '高',
            name: '传统收购热门'
        },
        {
            grade: '中',
            name: '热门收购热门'
        },
        {
            grade: '低',
            name: '传统收购传统'
        }
    ],


    gradePrice: ['(0,0.8]', '(0.8,1]', '(1,1.25]', '1.25以上'],
    gradeActivism: ['(50%,100%]', '(30%,50%]', '(15%,30%]', '(0,15%]'],
    gradePEG: ['(0,0.8]', '(0.8,1.3]', '(1.3,2.5]', '2.5以上'],
    gradePB: ['(0,0.8]', '(0.8,1.1]', '(1.1,2]', '2以上'],

    typeText: {
        'PEG': '增速',
        'PB': '基本面'
    },

    color: {
        LTM: '#f66',
        historical: '#cfe0fc',
        commitment: '#90cdfd',
        after: '#5d99e6'
    },

    moveTime: 500,
    showTime: 3000
}
