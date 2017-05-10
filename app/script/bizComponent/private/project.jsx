/**
 * @file 定增弹窗-项目介绍
 * @author min.chen@joudou.com
 */

var React = require('react');
var _ = require('lodash');

var Project = React.createClass({

    getDefaultProps: function () {
        return {
            data: {}
        }
    },

    formatData: function () {
        var me = this;
        var {
            props: {
                data: {
                    project_desc
                }
            }
        } = this;
        var result = [];

        _.forEach(project_desc, function (item) {
            result.push({
                text: item.name,
                time: +item.period ? (+item.period).toFixed(1) : '-',
                invest: me.getValue(item.invest),
                value: me.getValue(item.earning)
            })
        });

        return {
            result: result
        }
    },


    getValue: function (earning) {
        var value;
        var YI = 100000000;

        if (!earning) {
            value = '-';
        }
        else if (earning < 500000) {
            value = (earning / YI).toFixed(3);
        }
        else if (earning < 5000000) {
            value = (earning / YI).toFixed(2);
        }
        else {
            value = (earning / YI).toFixed(1);
        }

        return value;
    },

        
    render: function () {
        var data = this.formatData();

        return (         
            <div className='content-box project'>
                <div className="name"><span>项目介绍</span></div>
                <table className="my-table">
                    <tbody>
                        <tr>
                            <td>项目</td>
                            <td>拟投入募集资金（亿）</td>
                            <td>建设期（年）</td>
                            <td>净利润（亿）</td>
                        </tr>
                    {
                        data.result.map(function (item) {
                            return (
                                <tr>
                                    <td>{item.text}</td>
                                    <td className="right-number">{item.invest}</td>
                                    <td className="right-number">{item.time}</td>
                                    <td className="right-number">{item.value}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        );
    }
});

module.exports = Project;