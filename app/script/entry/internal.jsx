var React = require('react');
var Internal = require('../page/internal');
var Head = require('../component/head');
var Foot = require('../component/foot');
var StockDialog = require('../bizComponent/stockDialog/main');

require('../../../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss');
require('../../style/entry/internal.scss');
require('../plugin/font.jsx');

React.render(
    <div>
        <Head type='small' item='msg'/>
        <Internal />
        <Foot />
        <StockDialog />
    </div>, 
$('#content')[0]);