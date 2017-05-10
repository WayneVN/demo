/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "表格中进度条"
 */


"use strict"
import React, {
  Component
} from 'react';
import _ from '_';
import {ProgressBar} from 'react-bootstrap';
import numeral from 'numeral';

const Progress = React.createClass({
  componentDidMount: function() {
  },

  getDefaultProps: function() {
    return {
      now: 0.1,
      bsStyle: 'danger',
      sub: false,
      subData: [],
      parentData: [],
      index: 0,
      color: 0,
      type: 1
    }
  },

  render: function() {
    const {
      props: {
        now,
        bsStyle,
        sub,
        subData,
        parentData,
        color,
        index,
        type
      }
    } = this;


    const label = (
      <span className="progress-label">
        {/* {numeral(now).format('0.0%')} */}
      </span>
    );
    let _bsStyle =  bsStyle;
    /* 母事件的右边距 */
    let sum = parentData < 1 ? 100 - (parentData  * 100): 0 ;
    /*     let _sum = sum;*/
    let num = 1;

    if (now > 1) {
      num = now/1; //倍数
    }
    if (parentData > 1) {
      num = parentData/1; //倍数
    }


    if (sub) {
      for(var i = 0; i < index; i++) {
        sum += parseInt(((subData[i].progress/num) * 100), 10);
      }
    }
    let _now  = ((now/num) * 100 >0) && ((now/num) * 100 <1) ? 1:(now/num) * 100;
    _bsStyle = `${ type==6 || type==7 ? 'progress-bar-success': 'progress-bar-danger'}  flr margin-r-${ parseInt(sum)==99?98:parseInt(sum) }`;


    return (
      <span className={`row-text-${ color==4 || color==7 ? 'greed':'red' }`}>
        <ProgressBar
            active
            now={ _now }
            bsStyle={_bsStyle}
            label={label}
            max = {100}
            min={0}
        />
        {numeral(now).format('0.0%')}
      </span>
    );
  }

});

module.exports = Progress;
