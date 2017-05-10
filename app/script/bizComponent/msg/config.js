/**
 * @file 消息神器-配置文件
 * @author min.chen@joudou.com
 */

module.exports = {

    type: [{
        name: '全部',
        key: 'all',
        icon: '',
    }, {
        name: '并购重组',
        key: 'merger',
        icon: 'iconfont icon-merger',
        children: ['借壳上市', '全现金', '发行股份']
    }, {
        name: '定向增发',
        key: 'private',
        icon: 'iconfont icon-private',
        children: ['大股东认购', '大股东不认购']
    }, {
        name: '内部交易',
        key: 'internal',
        icon: 'iconfont icon-internal',
        children: ['大股东增持', '高管增持', '公司回购', '员工激励', '减持']
    }],

    mergerField: 'merger',
    privateField: 'private',
    internalField: 'internal',

    dateTag: [{
        name: '最近三天',
        value: 'latest'
    }, {
        name: '近一个月',
        value: '1 month'
    }, {
        name: '近三个月',
        value: '3 month'
    }],


    pageCnt: 100

}
