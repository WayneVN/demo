import React, {Component} from 'react';
import If from './If';
export default class SearchComponent extends Component {
	constructor(props) {
    super(props);
  }
  static defaultProps = {
		result:[]
  }
  state = {
		val:this.props.val,
		result:this.props.result,
		active:0
	}
	handleChange = (e) =>{
		this.setState({val:e.target.value});
		this.props.onChangeCallback(e.target.value);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.result != this.props.result) {
				this.setState({
					result:nextProps.result,
					active:0
				});
		}
	}
	onKeyItem =(e)=>{
		const keys ={
			DOWN_KEY : 40,
			ENTER_KEY : 13,
			ESC_KEY : 27,
			TAB_KEY: 9,
			UP_KEY : 38,
		};
		let {state,props} = this;
		switch (e.keyCode) {
			case keys.DOWN_KEY:
				this.setState({
					active:state.active<props.result.length -1 ? state.active+1 : props.result.length-1
				});
				break;
			case keys.UP_KEY :
				this.setState({
					active:state.active>=1? state.active-1:0
				});
				break;
			case keys.ENTER_KEY :
				this.props.onSearch(this.state.result[state.active]);
				this.setState({
					 val: this.state.result[state.active],
					 result:[]
				});
				break;
			case keys.ESC_KEY:
				this.setState({
					result:[]
				});
				break;
		}
	}
	onCloseItem =(e)=>{
		this.setState({result:[]});
	}
	onClickItem =(e)=>{
		this.setState({
			val:e.target.title,
			result:[]
		});
		this.props.onSearch(e.target.title);
	}
	handleFocus=(e)=>{
		this.props.handleFocus();
	}
	handleBlur=(e)=>{
		this.props.handleBlur();
	}
  render () {
    return(
      <div className="autocomplete mhs" >
        <input placeholder={this.props.placeholder}
					value={this.state.val}
					onChange={this.handleChange}
					onKeyDown={this.onKeyItem}
					className="autocomplete-input form-control"
					onFocus={this.handleFocus}
					onBlur = {this.handleBlur}
				  type="search" />
				<If when={this.state.result.length>=1}>
					<ul className="autocomplete-list" >
						{this.state.result.map((item,key)=>{
								return <li key={key} onClick={this.onClickItem}>
													<a href="javascript:;"  title={item}
														className={this.state.active==key?'autocomplete-item highlighted':'autocomplete-item'}>
														{item}
													</a>
												</li>
						})}
					</ul>
				</If>
      </div>
		)
	}
}
