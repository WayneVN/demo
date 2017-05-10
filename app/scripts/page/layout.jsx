const React = require('react');
const Router = require('react-router');
const RouteHandler = Router.RouteHandler;
const Header = require('../component/head');
const Footer = require('../component/foot');
var Include = require("../component/include");
var DoumiDialog = require("../bizComponent/doumi/main");
import If from '../components/If';
const UserInfo = require('../util/userInfo');
import MergerModal from '../model/mergerModal';
const Model = new MergerModal();
const Reflux = require('reflux');
const LoginStore = require('../stores/LoginStore');
const LoginActions = require('../actions/LoginActions');
const ReloadStore = require('../stores/ReloadStore');

var Layout = React.createClass({
  /* mixins: [
   *   Reflux.connectFilter(ReloadStore, 'userInfo', function(data) {
   *     this.getData();
   *     return data;
   *   }),
   * ],*/

  getInitialState: function() {
    return {
      blocked: false,
    };
  },
  /*
   *   componentDidMount: function() {
   *     this.getData();
   *   },
   *
   *   componentWillReceiveProps: function(nextProps) {
   *     this.getData();
   *   },
   *
   *   getData: function() {
   *     Model.userinfo((data) => {
   *       this.setState({
   *         blocked: true
   *       });
   *     });
   *   },*/

  render: function() {
    return (
      <div className="App">
        <Header />
        <Include />
        <DoumiDialog />
        {/* <If when={this.state.blocked}> */}
        <RouteHandler />
          {/* </If> */}
        <Footer />
      </div>
    );
  }
});

module.exports = Layout;
