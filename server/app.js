var express = require('express');
var path = require('path');
var glob = require('glob');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var useragent = require('express-useragent');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

if (process.env.NODE_ENV == 'local') {
    app.use(express.static(path.join(__dirname, '../dist')));
}
else {
    app.use(express.static('/home/works/apps/joudou/newDev/dist'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(useragent.express());

var controllers = glob.sync(path.join(__dirname, './controller/*.js'));

controllers.forEach(function(controller) {
    require(controller)(app);
});

if (process.env.NODE_ENV == 'local') {
    require('./mock/reqMock')(app);
}


module.exports = app;
