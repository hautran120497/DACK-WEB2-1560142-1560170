const
    express = require('express'),
    config = require('../config'),
    axios = require('axios');

const router = express.Router();

router.post('/', (req, res) => {
    if (req.body['g-recaptcha-response']) {
        var secret = config.recapchar.secret;
        var response = `${req.body['g-recaptcha-response']}`;

        axios({
            method: 'post',
            url: `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${response}`
        }).then(response => {
            res.statusCode = 200;
            res.json(response.data);
        }).catch(err => {
            console.log(er);
            res.statusCode = 500;
            res.json(config.interal_error(err));
        });
    } else {
        res.statusCode = 400;
        res.json({ message: 'missing g-recaptcha-response' });
    }
});

module.exports = router;