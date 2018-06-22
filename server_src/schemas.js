const sequelize = require('sequelize'); 

var cn = new sequelize('webdaugia', 'root', 'root', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

exports.category = cn.import('./models/categories.js');
exports.product = cn.import('./models/products.js');
exports.kickout = cn.import('./models/kickout.js');
exports.bidlog = cn.import('./models/bidlog.js');
exports.bid = cn.import('./models/bid.js');
exports.watchlist = cn.import('./models/watchlist.js');
exports.user = cn.import('./models/user.js');
exports.user_evaluate = cn.import('./models/user_evaluate.js');
exports.user_validate = cn.import('./models/user_validate.js');
exports.gainvip = cn.import('./models/gainvip_request.js');
exports.cn = cn;