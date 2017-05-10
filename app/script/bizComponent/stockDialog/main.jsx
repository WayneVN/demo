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
var Storage = require('../../util/storage').default;
var logger = require('../../util/logger');
var _ = require('lodash');
var DialogStore = require('../../store/dialogStore');
var DialogAction = require('../../action/dialogAction');
var globalConfig = require('../../util/globalConfig');

var StockDialog = React.createClass({

    getInitialState: function () {
        this._listenHandler = DialogStore.listen(this.dialogHandler);
        return {
            annoType: new Storage().getStore(globalConfig.annoName) || 0,
            data: {}
        };
    },


    componentDidMount: function () {
        $('.modal').css('position', 'fixed');
    },

    componentWillMount: function () {
    },

    componentWillReceiveProps: function (nextProps) {
        
    },

    componentWillUnmount: function () {
        this._listenHandler();  
    },

    dialogHandler: function (option) {
        var me = this;
        var temp;
        if (option[0] == DialogAction.Dialog.StockDialog) {
            temp = _.cloneDeep(option[1]);
            temp.show = true;
            me.setState(temp, function () {
                me.getData();
                me.getSelfStock();
                me.log();
            });
        }
        else {
            me.setState({
                show: false
            })
        }
    },

    log: function () {
        logger.log({
            target: 'secuinfo.dashboard',
            data: {
                code: this.state.stockId
            }
        });
    },

    getData: function () {
        var me = this;

        if (me.state.stockId) {
            model.getData(this.state.stockId, function (err, data) {
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
        }
    },

    getSelfStock: function () {
        var me = this;

        var userid = new Storage().getStore('USER_ID');

        if (userid && me.state.stockId) {
            model.getSelfStock(function (error, data) {
                var hasAdd = 1;

                _.forEach(data.data, function (item, index) {
                    if (item.secucode.toUpperCase() == me.state.stockId.toUpperCase()) {
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
                show,
                stockId,
                annoType
            }
        } = this;


        return (
            <div>
                <If when={show}>
                    <Dialog ref="stockDialog" dialogClassName="stock-dialog">
                        <div className="bs-modal ">
                            <If when={hasData}>

                                <div className="modal-container" >
                                    <BasicInfo close={this.close} data={data} stockId={stockId} 
                                        hasAdd={hasAdd} annoType={annoType}
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
                </If>
            </div>
        );
    }
});

module.exports = StockDialog;
