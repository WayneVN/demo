const React = require('react');
const Router = require('react-router');
const Route = Router.Route;
const DefaultRoute = Router.DefaultRoute;
const Layout = require('./page/layout');
const Home = require('./page/home');
const Tracking = require('./page/tracking');
const Contrast = require('./page/contrast');
const InternalSub = require('./components/internal/layout');
const InternalList = require('./page/internallist');
const Summer = require('./page/summer');
const RightInsider = require('./components/right_insider');
const RightInsiderDetail = require('./components/right_insider_detail');
const SummerAccount = require('./components/summerUser/account');
const SummerAnswer = require('./components/summerUser/answer');
const SummerTask = require('./components/summerUser/task');

const SummerList = require('./components/springUser/list');
const SingTaskList = require('./components/springAdmin/userListModule/singleTaskList');
const SummerAdmin = require('./page/summerAdmin');
const SummerTaskList = require('./components/summerAdmin/taskList');
const SummerTaskTable = require('./components/summerAdmin/taskListModule/taskTable');
const SummerUpdateTask = require('./components/summerAdmin/taskListModule/updateTask');
const SummerUserList = require('./components/summerAdmin/userList');
const SummerAnswerList = require('./components/summerAdmin/answerList');
const SummerSingTaskList = require('./components/summerAdmin/userListModule/singleTaskList');
const TrackingIndex = require('./bizComponent/tracking/index');
const TrackingUpload = require('./bizComponent/tracking/upload/layout');
const TrackingReport = require('./bizComponent/tracking/report/layout');
const TrackingDiagnosed = require('./bizComponent/tracking/diagnosed/index');
const TrackingHelp = require('./bizComponent/tracking/help/index');
const CampIndex = require('./bizComponent/camp/campIndex');
const CampPlay = require('./bizComponent/camp/campPlay');
const WebIndex = require('./page/webIndex');
import Index from './page/index';
import MergerModal from './model/mergerModal';
const Model = new MergerModal();
require('../../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss');
require('../styles/main.scss');
require('../styles/less/index.less');
require('../fonts/fontawesome-webfont.eot');
require('../fonts/fontawesome-webfont.svg');
require('../fonts/fontawesome-webfont.ttf');
require('../fonts/fontawesome-webfont.woff');
require('../fonts/fontawesome-webfont.woff2');
require('./plugin/main');
const routes = (
  <Route name="layout" path="/" handler={Layout}>
    <Route path="/home" handler={Home}/>
    <Route name="contrast" path="/contrast/:id" handler={Contrast}/>

    <Route name="insider" path="/merger/:sid/:eid/insider" handler={InternalList}>
      <Route path="list" handler={InternalSub}/>
      <Route path="detail" handler={RightInsiderDetail}/>
      <DefaultRoute handler={InternalSub}/>
    </Route>

    <Route name="account" path="/account" handler={Tracking}>
      <Route path="upload" handler={TrackingUpload}/>
      <Route path="report" handler={TrackingReport}/>
      <Route  path="help" handler={TrackingHelp} />
      <Route  path="diagnosed" handler={TrackingDiagnosed} />
      <DefaultRoute handler={TrackingIndex}/>
    </Route>

    <Route name="campIndex" path="/campIndex" handler={CampIndex}/>

    <Route name="campPlay" path="/campPlay/:id" handler={CampPlay}/>


    <Route name="camps" path="/camps/:courseId" handler={Summer}>
      <DefaultRoute handler={SummerAccount}/>
      <Route path="account" handler={SummerAccount}/>
      <Route path="answer" handler={SummerAnswer}/>
      <Route path="task" handler={SummerTask}/>
      <Route path="list/:type/:id" handler={SummerList}/>
    </Route>

    <Route name="campsadmin" path="/campsAdmin" handler={SummerAdmin}>
      <Route path="tasklist" handler={SummerTaskList}/>
      <Route path="tasktable/:id" handler={SummerTaskTable}/>
      <Route path="updatetable/:id" handler={SummerUpdateTask}/>
      <Route path="userlist" handler={SummerUserList}/>
      <Route path="answerlist" handler={SummerAnswerList}/>
      <Route path="single/:sid" handler={SummerSingTaskList}/>
      <DefaultRoute handler={SummerTaskList}/>
    </Route>


    <Route name="WebIndex" path="/webIndex" handler={WebIndex}/>
    <DefaultRoute handler={WebIndex}/>

  </Route>
);
exports.start = function () {
  Model.userinfo(result => {
    Router.run(routes, function (Handler) {
      React.render(<Handler />, document.getElementById('content'));
    });
  });
}
