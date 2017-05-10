var express = require('express');
var router = express.Router();
var request = require('../util/request');
var urlController = require('../util/urlController');

module.exports = function(app) {
    app.use('/', router);
}

router.get('/internal/*.html', (req, res, next) => {
    var id = getID(req.url);
    request(
        req,
        {
            url: '/stockinfogate/internal/' + id
        }, (response) => {
            var obj = JSON.parse(response);
            var data = obj.data || {};

            res.render('internal', {
                env: urlController.getEnv(req),
                _joudou: response,
                title: data.event.name,
                keyword: '九斗数据,消息神器,选股神器,炒股消息,内部交易,' + data.stock_name + ',' + data.stock_id,
                description: getText(data.serial_events.description)
            });
        }
    )
    
});

router.get('/merger/*.html', (req, res, next) => {
    var id = getID(req.url);
    request(
        req,
        {
            url: '/stockinfogate/merger/' + id
        }, (response) => {
            var obj = JSON.parse(response);
            var data = obj.data || {};

            res.render('merger', {
                env: urlController.getEnv(req),
                _joudou: response,
                title: data.meta.title,
                keyword: '九斗数据,消息神器,选股神器,炒股消息,并购重组,' + data.meta.stockName + ',' + data.meta.stockId,
                description: getText(data.description.description)
            });
        }
    )
});

router.get('/msgList.html', (req, res, next) => {
    res.render('msgList', {});
});

router.get('/private/*.html', (req, res, next) => {
    var id = getID(req.url);
    request(
        req,
        {
            url: '/stockinfogate/private/' + id
        }, (response) => {
            var obj = JSON.parse(response);
            var data = obj.data || {};

            res.render('private', {
                env: urlController.getEnv(req),
                _joudou: response,
                title: data.title,
                keyword: '九斗数据,消息神器,选股神器,炒股消息,定向增发,' + data.stock_name + ',' + data.stock_id,
                description: getText(data.description)
            });
        }
    )
});


function getID(url) {
    var temp = url.split('/');
    return temp[temp.length - 1].split('.')[0];
}

function getText(description) {
    return description.replace(/<\/?span>/g, '');
}