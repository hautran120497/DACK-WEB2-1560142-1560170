const express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors'),
    jwt = require('jsonwebtoken'),
    path = require('path'),
    fn = require('./fn/schedule'),
    schedule = require('node-schedule'),
    config = require('./config');

//init 
const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//controller
const categoryCtrl = require('./apiControllers/categoryController'),
    productCrtl = require('./apiControllers/productController'),
    userCrtl = require('./apiControllers/userController'),
    bidCrtl = require('./apiControllers/bidController'),
    authCrtl = require('./apiControllers/authController'),
    recapcharCtrl = require('./apiControllers/capcharController');

//root route
app.get('/', (req, res) => {
    var ret = {
        msg: 'hello from nodejs api'
    };
    res.json(ret);
});

app.post('/test', (req, res) => {
    console.log(req.body);
    res.end('end mtfker');
});

// app.use((req, res, next) => {
//     var token = req.headers['x-access-token'];
//     if (token) {
//         jwt.verify(token, config.secret, (err, payload) => {
//             if (err) {
//                 res.statusCode = 401;
//                 res.json({
//                     msg: 'verify failed',
//                     error: err
//                 });
//             } else {
//                 req.tokenPayload = payload;
//                 next();
//             }
//         });
//     } else {
//         res.statusCode = 401;
//         res.json({
//             msg: 'no token found'
//         });
//     }
// });

//child route
app.use('/categories', categoryCtrl);
app.use('/products', productCrtl);
app.use('/users', userCrtl);
app.use('/bids', bidCrtl);
app.use('/auth', authCrtl);
app.use('/recapchar', recapcharCtrl);

//public image
var staticDir = express.static(
    path.resolve(__dirname, 'public')
);
app.use(staticDir);

//listen
app.listen(3000, () => {
    console.log('API running on port 3000');
});

// var j = schedule.scheduleJob(config.timeSchedule, function(){
//     console.log('Task Running!');
//     fn.updateProductState();
//   });