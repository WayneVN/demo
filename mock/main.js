var paths = [
    require('./userInfo'),
    require('./tally'),
    require('./commonApi'),
    require('./daily'),
    require('./sum'),
    require('./property'),
    require('./upload'),
    require('./ratio'),
    require('./spring'),
    require('./msg'),
    require('./msgNew'),
    require('./camp'),
    require('./stock'),
    require('./stockDialog'),
    require('./nints'),
    require('./doumi'),
    require('./tag'),
    require('./tracking'),
    require('./internal'),
    require('./merger'),
    require('./DA'),
    require('./favorstock'),
];

var response = {};

paths.forEach(function (item, index) {
    for(var path in item.res) {
        response[path] = item.res[path];
    }

    var mod = item.mod || [];

    for (var k in mod) {
        response[mod[k]] = function () {
            return {
                status: 200,
                data: ''
            }
        }
    }
});

exports.response = response;
