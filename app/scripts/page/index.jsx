import React,{Component} from 'react';
import CarouselIndex from '../components/CarouselIndex';

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clazz1:'active-dot',
      clazz2:'',
      clazz3:'',
      index:0
    };
  }
  componentDidMount(){ }
  cb=index=>{
    this.setState({
      clazz1:index==0?'active-dot':' ',
      clazz2:index==1?'active-dot':' ',
      clazz3:index==2?'active-dot':' ',
    });
  }
  switchBanner(index){
    this.setState({
      index:index
    });
  }
  render() {
    let {clazz1,clazz2,clazz3} = this.state;
    return (
      <div>
        <div className="banner">
          <div className="warp-center">
            <img className="banner-fdj" src="../../images/fdj.png" />
          </div>
        </div>
        <div className="slider-warp">
          <div className="warp-center">
            <CarouselIndex cb ={this.cb} index={this.state.index}/>
          </div>
        </div>
        <div className="card-warp">
            <div className="warp-center" >
              <div className={`banner-dot ${clazz1}`} onClick={event=>{this.switchBanner(0)}}>
                <div className="banner-round" >Data</div>
                <div className="banner-btn">数据</div>
              </div>
              <div className={`banner-dot ${clazz2}`} onClick={event=>{this.switchBanner(1)}}>
                <div className="banner-round" >
                  Before<br />
                  investment
                </div>
                <div className="banner-btn">投前</div>
              </div>
              <div className={`banner-dot ${clazz3}`} onClick={event=>{this.switchBanner(2)}}>
                <div className="banner-round" >
                  After<br/>
                  investment
                </div>
                <div className="banner-btn">投后</div>
              </div>
            </div>
        </div>
      </div>
    );
  }
}
