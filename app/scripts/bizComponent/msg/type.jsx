/**
 * @file 消息神器-类型选择区域
 * @author min.chen@joudou.com
 */

var React = require('react');
var _ = require('lodash');
var If = require('../../component/if');
var $ = require('jquery');
var config = require('./config');

var Type = React.createClass({

    getDefaultProps: function () {
        return {
            data: {}
        }
    },

    formatData: function () {
        var me = this;
        var {
            props: {
                data,
                category,
                type
            }
        } = me;
        var typeArr = [];
        var temp = [];
        var showChildren = [];
        var childClass = 'child-container ';
        var selectedName;

        _.forEach(config.type, function (item) {
            var name = item.name;
            typeArr.push({
                key: item.key,
                name: name,
                icon: item.icon,
                clazz: item.key == category ? 'current' : '',
                value: me.getValue(name, data.count)
            });

            if (item.key == category) {
                temp = _.cloneDeep(item.children);
                childClass += item.key;
                selectedName = name;
            }
        });

        _.forEach(temp, function (item) {
            showChildren.push({
                name: item,
                value: me.getValue(selectedName, data.count, item),
                clazz: item == type ? 'current' : ''
            });
        });


        return {
            typeArr: typeArr,
            showChildren: showChildren,
            childClass: childClass
        }

    },

    getValue: function (name, count, key) {
        if (typeof count[name] == 'number') {
            return count[name];
        }
        else {
            return count[name][key || '全部'];
        }
    },
        
    render: function () {
        var me = this;
        var {
            props: {
                clickType,
                clickChild
            }
        } = me;
        var data = me.formatData();

        return (         
            <div className='msg-type'>
                <div className="type-area">
                {
                    data.typeArr.map(function (item) {
                        return (
                            <span className={"type-item " + item.clazz} onClick={()=>{clickType(item.key)}}>
                                <i className={item.icon} />
                                <span>{item.name}</span>
                                <span className="right color-text">{item.value}条</span>
                            </span>
                        )
                    })
                }
                </div>

                <div>
                    <span className={data.childClass}>
                    {
                        data.showChildren.map(function (item) {
                            return (
                                <span className={"child-item " + item.clazz} onClick={()=>{clickChild(item.name)}}>
                                    <span>{item.name}</span>
                                    <span className="right">{item.value}条</span>
                                </span>
                            )
                        })
                    }    
                    </span>
                </div>
            </div>
        );
    }
});

module.exports = Type;