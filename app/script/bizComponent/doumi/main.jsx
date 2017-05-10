/**
 * @file 斗米-主页面
 * @author min.chen@joudou.com
 */
var React = require('react');
var Dialog = require('../../component/dialog');
var If = require('../../component/if');
var logger = require('../../util/logger');
var Guess = require('./guess');
var Warning = require('./warning');
var Bet = require('./bet');
var Beted = require('./beted');
var Over = require('./over');
var Result = require('./result');
var _ = require('lodash');
var model = require('../../model/doumiModel');
var moment = require('moment');
var DoumiStore = require('../../stores/doumiStore');
var logger = require('../../util/logger');
var DoumiEntryAction = require('../../actions/doumiEntryAction');


var DoumiDialog = React.createClass({

    _listenHandler: '',

    getInitialState: function () {
        this._listenHandler = DoumiStore.listen(this.change);
        return {
            data: {}
        };
    },


    componentDidMount: function () {
        var me = this;
        
        me.setState(me.props);
    },

    componentDidUpdate: function () {
        this.upDateZIndex();
    },

    upDateZIndex: function () {
        var seed = this.refs.seed;
        if (seed) {
            var element = this.refs.seed.getDOMNode();
            var modal = $(element).parents('.modal');

            modal.css('z-index', 1060);
            modal.parent().find('.modal-backdrop').css('z-index', 1055);

        }
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState(nextProps);
    },

    componentWillUnmount: function () {
        this._listenHandler();
    },


    change: function (type, stateData) {
        if (type == 'close') {
            this.close();
        }
        else if (type == 'open') {
            logger.log({target: 'uc.web_doumi_dialog_open'});
            this.setState(stateData);
        }
    },

    close: function () {
        this.setState({
            data: {},
            lastType: '',
            type: ''
        });
    },

    showWarning: function () {
        var me = this;
        var data = me.state.data;

        if (moment(data.pool.stop_time + '').toDate() > moment().toDate()) {
            me.transfer('warning');
        } 
        else {
            me.close();
        }
    },

    transfer: function (type, param) {
        var lastType = this.state.type;

        var temp = _.cloneDeep(param || {});
        temp.type = type;
        temp.lastType = lastType;

        this.setState(temp);
    },

    refresh: function () {
        DoumiEntryAction.refresh();
    },

    back: function () {
        var type = this.state.lastType;

        this.setState({
            type: type,
            lastType: ''
        });
    },

    getType: function () {
        var me = this;
        var {
            state: {
                data,
                type
            }
        } = me;

        var bets;

        if (!type && data.pool) {
            bets = data.bets || [];

            // 竞猜结束了
            if (data.pool.status == 'open') {
                if (bets.length) {
                    type = 'beted';
                }
                else {
                    type = 'guess';
                }
            }
            else {
                if (!bets.length) {
                    type = 'over';
                }
                else if (!data.result) {
                    type = 'beted';
                }
                else {
                    type = 'result';
                }
            }
        }

        return type;
    },

    render: function () {
        var me = this;
        var {
            state: {
                data,
                betType
            }
        } = me;

        var type = me.getType();

        if (type && data.pool) {

            return (
                <Dialog ref="doumiDialog" dialogClassName="doumi-dialog">
                    <div className="bs-modal ">
                        <div className="modal-container" >
                            <div ref="seed">
                            <If when={type == 'guess'}>
                                <Guess data={data} warning={me.close} close={me.close} transfer={me.transfer}/>
                            </If>
                            
                            <If when={type == 'warning'}>
                                <Warning data={data} back={me.back} close={me.close}/>
                            </If>

                            <If when={type == 'bet'}>
                                <Bet data={data} back={me.back} warning={me.close} type={betType} refresh={me.refresh}/>
                            </If>                        

                            <If when={type == 'beted'}>
                                <Beted data={data} warning={me.close} transfer={me.transfer}/>
                            </If>

                            <If when={type == 'result'}>
                                <Result data={data} warning={me.close}/>
                            </If>

                            <If when={type == 'over'}>
                                <Over data={data} warning={me.close}/>
                            </If>
                            </div>
                        </div>

                    </div>
                </Dialog>
            );
        }

        return <div></div>
    }
});

module.exports = DoumiDialog;