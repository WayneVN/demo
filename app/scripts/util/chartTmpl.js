"use strict";
/**
 * 图表数据格式模版
 */
const format = require('../util/format');
const _ = require('_');
const moment = require('moment');
const numeral = require('numeral');

var line = {
  option: {
    title: {
      show: false
    },
    tooltip: {
      trigger: 'axis',
    },
    loadingOption: {
      text: '数据读取中...'
    },
    calculable: false,
    xAxis: [{
      type: 'category',
      boundaryGap: false,
      data: [],
      splitLine: {
        show: false
      },
      axisLabel: {
        interval: 30,
        rotate: 30,
        textStyle: {
          color: '#d9dbdd'
        },
      }
    }],
    yAxis: [{
      splitLine: {
        show: false
      },
      type: 'value',
      // boundaryGap: [0.1, 0.1],
      axisLabel: {
        formatter: '{value}元'
      }
    }],
    axis: [{
      splitLine: {
        show: false,
      },
    }],
    series: [{
      name: '收盘价',
      type: 'line',
      data: [],
      symbolSize: 0,
      itemStyle: {
        normal: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          }
        }
      },
      markPoint: {
        data: [{
          name: '最大值',
          type: 'max',
          symbol: 'circle',
          symbolSize: 4,
          itemStyle: {
            normal: {
              color: 'rgb(255,0,30)', //线条颜色
              label: {
                show: false,
                position: 'inside',
                textStyle: {
                  fontSize: '10'
                }
              }
            },
            emphasis: {
              color: 'rgb(255,185,26)',
              label: {
                show: false,
                position: 'inside',
                textStyle: {
                  fontSize: '10'
                }
              }
            }
          }
        }, {
          name: '最小值',
          type: 'min',
          symbol: 'circle',
          symbolSize: 4,
          itemStyle: {
            normal: {
              color: 'rgb(51,194,109)', //线条颜色
              label: {
                show: false,
              }
            },
            emphasis: {
              color: 'rgb(255,185,26)',
              label: {
                show: false,
                position: 'inside',
                textStyle: {
                  fontSize: '10'
                }
              }
            }
          }
        }, {
          name: '最新值',
          value: 1,
          xAxis: -1,
          yAxis: -1,
          symbol: 'circle',
          symbolSize: 0,
          itemStyle: {
            normal: {
              color: 'rgb(255,185,26)',
              label: {
                show: false,
              }
            },
            emphasis: {
              color: 'rgb(255,185,26)',
              label: {
                show: false,
                position: 'left',
                textStyle: {
                  fontSize: '10'
                }
              }
            }
          }
        }]
      },
      markLine: {
        data: []
      }
    }]
  } //由store中读取数据
};

var k = {
  option: {
    title: {

    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        var res = params[0].seriesName + ' ' + params[0].name;
        res += '<br/>  开盘 : ' + params[0].value[0] + '  最高 : ' + params[0].value[
          3];
        res += '<br/>  收盘 : ' + params[0].value[1] + '  最低 : ' + params[0].value[
          2];
        return res;
      }
    },
    toolbox: {
      show: false,
    },
    dataZoom: {
      show: false,
    },
    xAxis: [{
      type: 'category',
      boundaryGap: true,
      axisTick: {
        onGap: false
      },
      show: false,
      axisLine: {
        lineStyle: {
          width: 1
        }
      },
      data: []
    }],
    yAxis: [{
      type: 'value',
      show: false,
      scale: true,
      boundaryGap: [0.01, 0.01],
      axisLine: {
        lineStyle: {
          width: 1
        }
      },
    }],
    series: [{
      name: '日期:',
      type: 'k',
      data: [ // 开盘，收盘，最低，最高
      ]
    }]
  }

}

var bar = {
  legend: {
    show: false,
    data: []
  },
  grid: {
    x2: 8
  },
  tooltip: {
    formatter: '{b}：<br/>{c}<br/>',
    show: true
  },
  calculable: false,
  xAxis: [{
    type: 'category',
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisLabel: {
      formatter: function(value) {
        var YEAR = moment(new Date)
          .year();
        return value == 'LTM' ? value : (value >= YEAR ? value + 'E' :
          value + '年');
      },
    },
    data: []
  }, ],
  yAxis: [{
    type: 'value',
    splitLine: {
      show: false
        //lineStyle: {
        //    type: 'dashed'
        //}
    },
    axisLabel: {
      formatter: function(value) {
        return value == 0 ? 0 : format.myriadFormat(value);
      }
    },
    boundaryGap: [0, 0.1]
  }],
  series: [{
      type: 'bar',
      data: [],
      itemStyle: {
        normal: {
          color: '#67b6f1',
          label: {
            show: true,
            textStyle: {
              color: '#67b6f1'
            },
            position: 'top',
            formatter: function(item) {
              return item.value == 0 ? '' : format.myriadFormat(item.value);
            }
          }
        }
      },
    },
    // {
    //   type:'bar',
    //   data:[],
    //   itemStyle: {
    //     normal: {
    //         color: 'red',
    //         label: {
    //             show: true,
    //             textStyle: {color: 'red'},
    //             position: 'top',
    //             formatter: function (item) {
    //                 return format.myriadFormat(item.value);
    //             }
    //         }
    //     }
    //   },
    // },
  ]
};

var pie = {
  tooltip: {
    trigger: 'item',
    // formatter: "{b} : {c} ({d}%)",
    formatter: "{b}:({d}%)",
  },
  legend: {
    orient: 'vertical',
    x: 350,
    y: 50,
    data: [],
    formatter: function(str) {
      return str.length >9 ?str.replace('（','\n（') :str;
    }
  },
  toolbox: {
    show: false,
  },
  calculable: false,
  series: [{
    name: '',
    type: 'pie',
    radius: ['50%', '70%'],
    itemStyle: {
      normal: {
        label: {
          show: false
        },
        labelLine: {
          show: false
        }
      },
      emphasis: {
        label: {
          show: false,
        },
      }
    },
    data: []
  }, {
    name: '',
    tooltip: {
      show: false
    },
    type: 'pie',
    center: [250, 100],
    radius: 50,
    itemStyle: {
      normal: {
        color: '#ff742f', //圆心的颜色
        label: {
          show: true,
          position: 'center',
          textStyle: {
            fontSize: 16,
            color: '#fff'
          },
          formatter: function(params) {

            return params.name + '\n\n' + format.moneyFormat(params.value);
          }
        },
        labelLine: {
          show: false
        }
      },
      emphasis: {
        label: {
          show: true,
          position: 'center',
          textStyle: {
            fontSize: 16,
            color: '#fff'
          },
          formatter: function(params) {
            return params.name + '\n\n' + format.moneyFormat(params.value);
          }
        },
      }
    },
    data: [{
      value: 1,
      name: '直接访问'
    }, ]
  }]
};

var dbar = {
  legend: {
    show: false,
    data: []
  },
  grid: {
    x2: 8
  },
  tooltip: {
    formatter: '{b}：<br/>{c}<br/>',
    show: true
  },
  calculable: false,
  xAxis: [{
    type: 'category',
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    },
    data: []
  }, ],
  yAxis: [{
    type: 'value',
    splitLine: {
      show: false
    },
    axisLabel: {
      formatter: function(value) {
        return value == 0 ? 0 : format.myriadFormat(value);
      }
    },
    boundaryGap: [1, 1]
  }],
  series: [{
    type: 'bar',
    data: [],
    itemStyle: {
      normal: {
        color: '#67b6f1',
        label: {
          show: true,
          textStyle: {
            color: '#67b6f1'
          },
          position: 'top',
          formatter: function(item) {
            return format.myriadFormat(item.value);
          }
        }
      },
    },
  }, ]
};

var labelTop = {
  normal: {
    label: {
      show: true,
      position: 'center',
      formatter: function(item) {
        return `${ item.name.split('|').join('\t') }`;
      },
      textStyle: {
        baseline: 'bottom',
        color: '#15325b',
        fontSize: 12
      }
    },
    labelLine: {
      show: false
    }
  }
};
var labelFromatter = {
  normal: {
    color: '#264d74',
    label: {
      formatter: function(params) {
        return 100 - params.value + '%'
      },
      color: '#264d74',
      textStyle: {
        baseline: 'top',
        color: '#264d74',
      }
    }
  },
};
var labelBottom = {
  normal: {
    color: "rgb(235, 235, 235)",
    label: {
      show: true,
      position: 'center',
      textStyle: {
        baseline: 'bottom',
        color: '#15325b',
        fontSize: 20
      }
    },
    labelLine: {
      show: false
    }
  },
};
var slingPie = {
  silent: true,
  toolbox: {
    show: false,
  },
  title: {
    show: false,
    text: '累计收益率',
    x: 'center',
    textStyle: {
      baseline: 'top',
      color: '#274982',
      fontSize: 12,
      fontWeight: 'normal'
    }
  },
  series: [{
    type: 'pie',
    center: ['50%', '50%'],
    radius: ['72%', '90%'],
    itemStyle: labelFromatter,
    data: [
      {
        name: '',
        value: 78,
        itemStyle: labelTop
      }, {
        name: '',
        value: 22,
        itemStyle: labelBottom
      },
      {
        name: 'xx',
        value: 0,
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: 'center',
              formatter: function(item) {
                return '超越用户比例';
              },
              textStyle: {
                baseline: 'top',
                color: '#274982',
              }
            },
            labelLine: {
              show: false
            }
          }
        }

      }
    ]
  },
  {
    name:'',
    type:'pie',
    selectedMode: 'single',
    radius: [0, '60%'],
    center: ['50%', '44%'],
    label: {
      normal: {
        show: false
      }
    },
    labelLine: {
      normal: {
        show: false
      }
    },
    itemStyle: {
      normal: {
        color: '#ebebeb'
      }
    },
    data:[
      {value:100, name:'', selected:true},
    ]
  },
  ]
};


var YCOLOR = '#bcbcbc';
var XCOLOR = '#bcbcbc';
var dailyBar = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'item'
    },
    formatter: function(params) {
      var first = params[0],
        second = params[1];
      if (params.length === 2) {
        return [
          first.name, '<br/>',
          (first.value < 0 ? '亏损' : '盈利'), '：', format.addCommas(first.value),
          '<br/>',
          '无杠杆', (second.value < 0 ? '亏损' : '盈利'), '：', format.addCommas(
            second.value)
        ].join('');
      } else {
        var prefix = first.seriesName.indexOf('无杠杆') !== -1 ? '无杠杆' : '';
        return [
          first.name, '<br/>',
          prefix, (first.value < 0 ? '亏损' : '盈利'), '：', format.addCommas(
            first.value)
        ].join('');
      }
    }
  },
  legend: {
    show: false,
    data: ['盈亏金额', '无杠杆盈亏'],
    // 默认不显示无杠杆数据
    selected: {
      '无杠杆盈亏': false
    },
    x: 'right',
    y: 20
  },

  grid: {
    top: 20,
    bottom: 0,
    left: 20,
    right: 20,
    containLabel: true
  },
  dataZoom: [{
    type: 'inside',
  }, {
    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
    height: 16,
    y: 350,
    fillerColor: '#15325b',
    backgroundColor: '#eee',
    dataBackground: {
      areaStyle: '#eee',
      lineStyle: {
        color: '#eee'
      }
    },
    right: 80,
    left: 80,
    handleStyle: {
      color: '#fff',
      shadowBlur: 3,
      shadowColor: 'rgba(0, 0, 0, 0.6)',
      shadowOffsetX: 2,
      shadowOffsetY: 2
    }
  }],
  /* dataZoom: [{
   *   type: 'inside',
   *   },{
   *   show: true,
   *   realtime: true,
   *   start: 0,
   *   end: 100,
   *   height: 16,
   *   y: 330,
   *   handleIcon: 'M8.2,13.6V3.9H6.3v9.7H3.1v14.9h3.3v9.7h1.8v-9.7h3.3V13.6H8.2z M9.7,24.4H4.8v-1.4h4.9V24.4z M9.7,19.1H4.8v-1.4h4.9V19.1z'
   * }],*/
  xAxis: [{
    type: 'category',
    splitArea: {
      show: false
    },
    boundaryGap: [0.1, 0.1],
    axisLine: {
      lineStyle: {
        width: 1
      }
    },
    interval: 3,
    axisLabel: {
      /* interval: 'auto',*/
      textStyle: {
        color:  '#bcbcbc',
      },
    },
    data: []
  }],
  yAxis: [{
    scale: true,
    minInterval: 1,
    boundaryGap: [0.2, 0.2],
    type: 'value',
    splitNumber: 3,
    axisTick: {
      show: true,
      length: 25,
      textStyle: {
        color: XCOLOR
      },
      lineStyle: {
        color: YCOLOR
      }
    },
    axisLine: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color:  YCOLOR,
      },
      formatter: function(value) {
        value = value == 0 ? 0 : numeral(value).format('0a');
        return `${ value } \n`;
      }
    },
  }],
  series: []
};

var ratioBar = {
  //animation: false,
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    },
  },
  //calculable: true,
  grid: {
    borderWidth: 0,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0)',
    x: 0,
    y: -1,
    x2: 0
  },
  xAxis: [{
    splitLine: {
      show: false
    },
    axisLabel: {
      textStyle: {
        align: 'right'
      },
      formatter: function(value) {
        return value + '%';
      }
    },
    // 底线
    axisLine: {
      lineStyle: {
        color: '#e6f0f9',
        width: 1
      }
    },
    boundaryGap: [0.1, 0.1],
    type: 'value'
  }],
  yAxis: [{
    type: 'category',
    axisLabel: {
      show: false
    },
    // y 轴0点
    axisLine: {
      lineStyle: {
        color: '#e6f0f9'
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['#f4f4f4', '#fff']
      }
    },
    splitLine: {
      lineStyle: {
        color: ['#e6f0f9']
      }
    },
    boundaryGap: true,
    axisTick: {
      show: false
    },
    data: []
  }],
  series: []
};

/**
 * 动态设置横坐标的interval
 * @param {number} length 数据个数
 * @param {number} 显示个数
 * @return {Function}
 */
function getInterval(length, num) {

  return function(index) {
    var piece = Math.floor(length / num);

    if (!piece) {
      return true;
    }

    if (index == length - 1) {
      return true;
    }

    if (!(index % piece)) {
      if (index == num * piece) {
        if (length - piece * num > 0.5 * piece) {
          return true;
        }
      } else {
        return true;
      }
    }

    return false;
  }
}

var chartTmpl = {
  line: line.option,
  k: k.option,
  bar: bar,
  dbar: dbar,
  pie: pie,
  slingPie: slingPie,
  dailyBar: dailyBar,
  ratioBar: ratioBar,
  getInterval: getInterval
};

module.exports = chartTmpl;
