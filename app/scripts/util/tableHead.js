"use strict";

var tableHead = {
    tableHeadMap:{
        'amount':'发生金额',
        'balance':'资金余额'
    },
    parseSting:function(arr){
        var list = [];
        for (var i = 0; i < arr.length; i++) {
            list.push(this.tableHeadMap[arr[i]]);
        }
        return list;
    }
}


module.exports = tableHead;
