import {Carousel,CarouselItem} from 'react-bootstrap';
import React,{Component} from 'react';
const _ = require('_');

export default class CarouselIndex extends Component {
  constructor(props){
    super(props);
    this.state ={
      index: 0,
      direction: null,
      time:8000,
      interval:1
    };
  }
  componentDidMount() {
    let {state:{time}} = this;
    let _index = 0;
    let interval = setInterval(()=> {
        this.setState({index:_index},()=>{
          _index++;
          if (_index==3) {
            _index=0;
          }
        });
    }, time);
    this.setState({
        interval:interval
    });
  }
  componentWillUpdate(nextProps, nextState) {
    let {index} = nextState;
    if (this.state.index!==index) {
        this.props.cb(index);
    }
    if (nextProps.index!==this.props.index) {
      this.setState({
        index: nextProps.index,
      });
    }
  }
  componentWillUnmount() {
    clearInterval(this.state.interval);
  }
  handleSelect=(selectedIndex, selectedDirection)=> {
    this.setState({
      index: selectedIndex,
      direction: selectedDirection
    });
  }
  render() {
    return (
      <Carousel
        activeIndex={this.state.index}
        direction={this.state.direction}
        onSelect={this.handleSelect}
        interval={2000}
        controls={false}
        >
       <CarouselItem>
         <div className="carousel-item1">
           <div className="c-l">
             <h3 className="c-title">
               数据
             </h3>
             <p>我们深陷信息过剩却思想匮乏的时代。<br/>
               九斗提供准确、有组织、高效的股票数据<br/>
             助你洞悉世界本来的面目，寻得长久稳盈之道。
           </p>
           </div>
           <div className="c-r">
             <img src="../../images/tz.png"  />
           </div>
         </div>
       </CarouselItem>
       <CarouselItem>
         <div className="carousel-item2">
           <div className="c-l">
             <img src="../../images/tq.png"  />
           </div>
           <div className="c-r">
             <h3 className="c-title">
               投前
             </h3>
             <p>帮你从繁杂数据中解析出真正有价值的信息。<br/>
               跨越零和博弈，提高每一次下注的赢面，<br/>
               九斗，做你投资战役中的幕僚。</p>
           </div>
         </div>
       </CarouselItem>
       <CarouselItem>
         <div className="carousel-item1">
           <div className="c-l">
             <h3 className="c-title">
               投后
             </h3>
             <p> 九斗解决你的复盘难题。<br/>
               以史为鉴，找出投资中的“弱点”，“盲区”，<br/>
               制定交易纪律，知己知彼，百战不殆。
             </p>
           </div>
           <div className="c-r">
             <img src="../../images/th.png"  />
           </div>
         </div>
       </CarouselItem>
     </Carousel>
    );
  }
}
