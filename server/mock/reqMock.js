var request = [
    require('../../mock/userInfo'),
    require('../../mock/tally'),
    require('../../mock/commonApi'),
    require('../../mock/daily'),
    require('../../mock/sum'),
    require('../../mock/property'),
    require('../../mock/upload'),
    require('../../mock/ratio'),
    require('../../mock/spring'),
    require('../../mock/msg'),
    require('../../mock/msgNew'),
    require('../../mock/camp'),
    require('../../mock/stock'),
    require('../../mock/stockDialog'),
    require('../../mock/nints'),
    require('../../mock/doumi'),
    require('../../mock/tag'),
    require('../../mock/tracking'),
    require('../../mock/internal'),
    require('../../mock/merger'),
    require('../../mock/DA'),
    require('../../mock/favorstock'),
];
var _ = require('lodash');
var router = require('express').Router();

module.exports = function (app) {
    app.use('/', router);
    _.forEach(request, function (item) {
        _.forEach(item, function (result, key) {
            _.forEach(item.res, function (m, n) {
                var url = n.split('_').join('/');

                _.forEach(['get', 'post'], function (func) {
                    router[func](url, function (req, res, next) {
                        console.log(req.url);
                        if (_.isFunction(m)) {
                            res.json(m(req.url))
                        }
                        else {
                            res.json(m);
                        }
                    });
                })
                
            })
            

            _.forEach(item.mod, function (m, n) {

                if (typeof n == 'string') {

                    var url = n.split('_').join('/');

                    _.forEach(['get', 'post'], function (func) {
                        router[func](url, function (req, res, next) {
                            console.log(req.url);
                            res.json({
                                status: 1
                            })
                        });
                    })
                }
            })
        })
    });
}
