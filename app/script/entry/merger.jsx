var React = require('react');
var Merger = require('../page/merger');
var Head = require('../component/head');
var Foot = require('../component/foot');
var StockDialog = require('../bizComponent/stockDialog/main');

require('../../../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss');
require('../../style/entry/merger.scss');
require('../plugin/font.jsx');

React.render(
    <div>
        <Head type='small' item='msg'/>
        <Merger />
        <Foot />
        <StockDialog />
    </div>, 
$('#content')[0]);