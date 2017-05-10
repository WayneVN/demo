var React = require('react');
var MsgPage = require('../page/msgList');
var Head = require('../component/head');
var Foot = require('../component/foot');

require('../../../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss');
require('../plugin/datePicker/main');
require('../../style/entry/msgList.scss');
require('../plugin/font.jsx');
React.render(
    <div>
        <Head type='small' item='msg'/>
        <MsgPage />
        <Foot />
    </div>, 
$('#content')[0]);