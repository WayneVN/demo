/**
 * @file 个股弹窗-配置文件
 * @author min.chen@joudou.com
 */

module.exports = {

    stockTypeName: '_STOCK_TYPE_',

    rankTypes: ['PE', 'PB', '净利润', '营收'],

    rankTypeNames: ['市盈率', '市净率', ['净利增速', '净利润'], ['营收增速', '营业收入']],

    rankTypeField: ['logpepbs', 'logpepbs', 'earning', 'revenue'],

    rankTypeName: '_RANK_TYPE_',

    kTypeField: ['restoration_forward', 'restoration_backward', 'origin'],


    maColor: {
        MA5: '#fdb22b',
        MA10: '#23c4e4',
        MA20: '#fc3db9',
        MA30: '#f9601e',
        MA60: '#1a98f8'
    },

    red: '#fb6969',
    green: '#65cd6b',

    showNumber: 50,

    dateTPL: 'YYYY/MM/DD',

    transparent : 'rgba(0,0,0,0)'
}
