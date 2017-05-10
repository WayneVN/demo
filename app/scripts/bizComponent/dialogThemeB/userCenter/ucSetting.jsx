/**
 * @file 个人中心-我的竞猜
 * @author min.chen@joudou.com
 */
var React = require('react');
var pageEnum = require('../../../util/pageEnum');
var _ = require('lodash');
var If = require('../../../component/if');
var moment = require('moment');
var storage = require('../../../util/storage').default;
var Storage = new storage();
var globalConfig = require('../../../util/globalConfig');

var UcSetting = React.createClass({

    getInitialState() {
        return{
            annoType: Storage.getStore(globalConfig.annoName)
        }
    },

    componentDidMount: function () {
    },

    transfer: function (params) {
        this.props.transfer({
            page: pageEnum.userAccount[params]
        });
    },

    render: function () {
        var me = this;

        return (
            <div className="uc-panel-body">
                <div className="uc-left-menu">
                    <ul className="uc-nav">
                        <li onClick={() => {this.transfer('integral')}}>我的积分</li>
                        <li onClick= {() => {this.transfer('doumi')}}>我的竞猜</li>
                        <li onClick={() => {this.transfer('lottery')}}>我的奖品</li>
                        <li className='uc-left-active'>喜好设置</li>
                    </ul>
                </div>

                <div className="uc-right-content">
                    {me.renderSetting()}
                </div>
            </div>
        );
    },

    setAnno: function (type) {
        var me = this;

        this.setState({
            annoType: type
        });

        Storage.setStore(globalConfig.annoName, type);
    },

    renderSetting: function () {
        var me = this;
        var annoType = this.state.annoType;
        return (
            <div>
                <p className="setting-title">预告设置选项：</p>
                <p className="setting-item">
                    <label>
                        <input type="radio" checked={!annoType} name="annoItem" value="0" onChange={() => this.setAnno(0)}/>
                        含预告数据
                    </label>
                </p>

                <p className="setting-item">
                    <label>
                        <input type="radio" checked={annoType} name="annoItem" value="1" onChange={() => this.setAnno(1)}/>
                        不含预告数据
                    </label>
                </p>
            </div>
        )
    }
});

module.exports = UcSetting;
