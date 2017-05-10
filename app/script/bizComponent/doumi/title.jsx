/**
 * @file 斗米框 title
 * @author min.chen@joudou.com
 */
var React = require('react');
var If = require('../../component/if');

var Title = React.createClass({

    render: function () {
        var {
            props: {
                text,
                close,
                clazz
            }
        } = this;


        return (
            <div className={"title " + clazz}>
                <If when={close}>
                    <span className="close-icon" onClick={close}><i className="fa fa-times"></i></span>
                </If>
                <span className="text">
                    <img src="/images/dice.png"/>
                    <span>{text}</span>
                </span>
            </div>
        );
    }
});

module.exports = Title;