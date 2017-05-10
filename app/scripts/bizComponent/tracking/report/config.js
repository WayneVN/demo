/**
 * @file 记账-配置文件
 * @author min.chen@joudou.com
 */

const value = {
    calType: {
        average: 0,
        total: 1
    },
    rankType: {
        value: 0,
        ratio: 1
    }
}

module.exports = {

    radio: {
        calType: [{
            name: 'cal-type',
            value: value.calType.average,
            text: '按平均收益计算'
        }, {
            name: 'cal-type',
            value: value.calType.total,
            text: '按累计收益计算'
        }],
        rankType: [{
            name: 'rank-type',
            value: value.rankType.value,
            text: '按盈亏金额'
        }, {
            name: 'rank-type',
            value: value.rankType.ratio,
            text: '按盈亏比例'
        }]
    },

    calType: value.calType,
    rankType: value.rankType
}
