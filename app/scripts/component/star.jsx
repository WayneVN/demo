/**
 * @file 星星控件
 * @author min.chen@joudou.com
 */

var React = require('react');

var Star = React.createClass({

    render: function () {
        var {
            props: {
                star
            }
        } = this;

        var icon = [];
        for (var i = 1; i < 6; i ++) {
            if (star >= i) {
                icon.push(<i className="fa fa-star" ></i>);
            }
            else if (star + 0.5 >= i) {
                icon.push(<i className="fa fa-star-half-o" ></i>);
            }
            else {
                icon.push(<i className="fa fa-star-o"></i>);
            }
        }

        return (
            <span>
            {
                icon.map(function (item) {
                    return item
                })
            }
            </span>
        )
    }
});


module.exports = Star;