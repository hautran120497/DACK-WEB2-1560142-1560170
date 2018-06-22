const
    express = require('express'),
    config = require('../config'),
    jwt = require('jsonwebtoken'),
    userRepo = require('../repos/userRepo'),
    md5 = require('md5'),
    fn = require('./fn');

const router = express.Router();

router.post('/login',
    fn.check_user_validated,
    (req, res, next) => {
        if (req.body.username && req.body.password) {
            if (req.user.password == md5(req.body.password)) next();
            else {
                //authentication failed
                res.statusCode = 401;
                res.json({
                    auth: false,
                    token: null,
                    message: 'password not match'
                });
            }
        } else {
            res.statusCode = 400;
            res.json({
                auth: false,
                token: null,
                message: 'params misssing'
            });
        }
    },
    (req, res) => {
        const payload = {
            user: req.body.username
        }
        const token = jwt.sign(payload, config.secret, {
            expiresIn: 900
        });

        res.statusCode = 200;
        res.json({
            auth: true,
            token: token,
            message: 'login success'
        });
    });

router.get('/logout', function (req, res) {
    res.statusCode = 200;
    res.json({ auth: false, token: null, message: "logout" });
});

router.post('/admin/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        res.statusCode = 400;
        res.json({ message: "missing params require" });
    } else {
        if (req.body.email == config.admin.email && password == config.admin.password) {
            res.statusCode = 200;
            res.json({ message: "login success" });
        } else {
            res.statusCode = 401;
            res.end("Wrong email or password");
        }
    }
});

module.exports = router;