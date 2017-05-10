/**
 * @file 个股弹窗-主页面
 * @author min.chen@joudou.com
 */
var React = require('react');
var Dialog = require('../../component/dialog');
var If = require('../../component/if');
var K = require('./k');
var Line = require('./line');
var Rank = require('./rank');
var BasicInfo = require('./basicInfo');
var model = require('../../model/stockDialogModel');
var logger = require('../../util/logger');
var _ = require('lodash');
var $ = require('jquery');
var storage = require('../../util/storage').default;
var Storage = new storage();
var globalConfig = require('../../util/globalConfig');

var StockDialog = React.createClass({

    getInitialState: function () {
        return {
            annoType: Storage.getStore(globalConfig.annoName) || 0,
            data: {}
        };
    },


    componentDidMount: function () {
        this.getData();
        this.getSelfStock();

        logger.log({
            target: 'secuinfo.dashboard',
            data: {
                code: this.props.stockId
            }
        });

        $('.modal').css('position', 'fixed');
    },

    getData: function () {
        var me = this;

        model.getData(this.props.stockId, function (err, data) {
            if (data.status) {
                me.setState({
                    data: data.data,
                    hasData: 1
                });
            }
            else {
                me.setState({
                    message: data.message || '数据异常'
                });
            }
            
        });
    },

    getSelfStock: function () {
        var me = this;

        var userid = Storage.getStore('USER_ID');

        if (userid) {
            model.getSelfStock(function (error, data) {
                var hasAdd = 1;

                _.forEach(data.data, function (item, index) {
                    if (item.secucode.toUpperCase() == me.props.stockId.toUpperCase()) {
                        hasAdd = 2;
                    }
                });
                me.setState({
                    hasAdd: hasAdd
                })
            });
        }
    },

    componentWillUnmount: function () {

    },

    close: function () {
        this.refs.stockDialog.closeDialog();
    },

    toggleAnnoType: function () {
        var me = this;
        var annoType = me.state.annoType;

        me.setState({
            annoType: (annoType + 1) % 2
        });
    },

    render: function () {
        var {
            state: {
                data,
                hasData,
                hasAdd,
                message,
                annoType
            },
            props: {
                stockId
            }
        } = this;


        return (
            <Dialog ref="stockDialog" dialogClassName="stock-dialog">
                <div className="bs-modal ">
                    <If when={hasData}>

                        <div className="modal-container" >
                            <BasicInfo close={this.close} data={data} 
                                stockId={stockId} hasAdd={hasAdd} annoType={annoType}
                                toggleAnnoType={this.toggleAnnoType}/>  
                            <div className="chart-container">
                                <Rank stockId={stockId} data={data} annoType={annoType}/>
                                <K stockId={stockId} data={data} annoType={annoType}/>
                                <Line stockId={stockId} data={data} annoType={annoType}/>
                            </div>

                        </div>

                    </If>

                    <If when={message}>
                        <div className="error-container">
                            <span className="close-icon" onClick={this.close}><i className="fa fa-times"></i></span>
                            <div className="message">{message}</div>
                        </div>
                    </If>
                </div>
            </Dialog>
        );
    }
});

module.exports = StockDialog;
