var React = require('react');

var LevelBlock = React.createClass({
    render: function () {
        var {
            props: {
                data,
                onClick
            }
        } = this;

        return (
            <div className={'level-block ' + 'level-block-' + data.gradeScore} onClick={() => {onClick && onClick()}}>
                <div className="level-bar">
                    <div className="level-bar-child"></div>
                </div>

                <div className="level-panel">
                    <div>
                        <span>{data.name}</span>
                        <span className="right">{data.score}</span>
                    </div>
                    <div className="color-line">
                        <span>评级</span>
                        <span className="right">{data.grade}</span>
                    </div>
                </div>
            </div>
        )
    }
});


module.exports = LevelBlock;