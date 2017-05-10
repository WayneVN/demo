import React, {Component} from 'react';
import FilterModal from '../model/filterModal';
import _ from '_';
import numeral from 'numeral';
import If from './If';


export default class Slider extends Component {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
   size:'default',//默认尺寸350px，每个数据点都显示
   data:{}
  }
  state = {
    density:{
      x:[],
      y:[]
    },
    size:this.props.size
  }
  static propTypes = {
    disabled: React.PropTypes.bool.isRequired,
    step: React.PropTypes.number.isRequired,
    initValue: React.PropTypes.string.isRequired,
  }
  render () {
    let {data,dataName} = this.props;
    if (!data.hasOwnProperty(dataName)) {
      return (<div></div>);
    }
    let density = data[dataName];
    let sum = [];
    if (this.props.size == 'sm') {
      let j = _.filter(_.range(100), function(num){ return num % 2 == 0; });//奇数
      let o = _.filter(_.range(100), function(num){ return num % 2 == 1; });//偶数
      let jnum = [];
      let onum = [];
      for (let i = 0; i < j.length; i++) {
        jnum.push(density.y[j[i]]);
      }
      for (let i = 0; i < o.length; i++) {
        onum.push(density.y[o[i]]);
      }
      for (let i = 0; i < jnum.length; i++) {
        sum.push((jnum[i]+onum[i])/2);
      }
    }
    return(
      <div className="slider">
        <div className="bg-bar">
            <If when={this.props.size=='sm'}>
              <div className="bg-density-sm">
                {sum.map((item,key)=>{
                    return <div key={key} className="bg-density-children" style={{ height:Math.ceil(item*0.2), left:key*3 }} />
                })}
              </div>
            </If>
            <If when={this.props.size!='sm'}>
              <div className="bg-density">
                {density.y.map((item,key)=>{
                    return <div key={key} className="bg-density-children" style={{ height:Math.ceil(item*0.2), left:key*4 }} />
                })}
              </div>
            </If>
          </div>
      </div>
    );
  }
}
