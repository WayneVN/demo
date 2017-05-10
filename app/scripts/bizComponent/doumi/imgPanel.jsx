/**
 * @file 斗米框 斗米图
 * @author min.chen@joudou.com
 */
var React = require('react');

var ImgPanel = React.createClass({

    render: function () {
        return (
            <div className="img-container">
                <div className="big-img">
                    <img className="doumi-icon" src="../images/doumi.png"/>
                </div>

                <div className="small-img">
                    <img className="doumi-icon" src="../images/doumi.png"/>
                    <img className="doumi-icon" src="../images/doumi.png"/>
                    <img className="doumi-icon" src="../images/doumi.png"/>
                    <img className="doumi-icon" src="../images/doumi.png"/>
                    <img className="doumi-icon" src="../images/doumi.png"/>
                    <img className="doumi-icon" src="../images/doumi.png"/>
                </div>
            </div>
        );
    }
});

module.exports = ImgPanel;