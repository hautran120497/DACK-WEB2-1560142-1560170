const userRepo = require('../repos/userRepo'),
    productRepo = require('../repos/productRepo'),
    config = require('../config');

exports.check_user_exist = (req, res, next) => {

    var username = (req.body.username || req.params.username || req.query.username);

    //check username exist
    if (!username) {
        res.statusCode = 400;
        res.json({ message: 'missing username param' });
    }

    console.log(":check user exist:");
    userRepo.load(username)
        .then(row => {
            if (row) {
                req.user = row;
                next();
            } else {
                res.statusCode = 400;
                res.json({ message: 'user not exist' });
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.json(config.interal_error(err));
        });

}

exports.check_product_exist = (req, res, next) => {
    var proID = (req.body.proID || req.params.proID || req.query.proID);
    //check product exist
    if (!proID) {
        res.statusCode = 400;
        res.json({ message: 'missing proID param' });
    }

    if (isNaN(proID)) {
        res.statusCode = 400;
        res.json({ message: 'proID is not a number' });
    }

    console.log(":check product exist:");
    productRepo.load(proID)
        .then(row => {
            if (row) {
                req.product = row;
                next();
            } else {
                res.statusCode = 400;
                res.json({ message: 'product not exist' });
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.json(config.interal_error(err));
        });
}

exports.check_user_validated = (req, res, next) => {

    var username = (req.body.username || req.params.username || req.query.username);

    //check username exist
    if (!username) {
        res.statusCode = 400;
        res.json({ message: 'missing username param' });
    }

    console.log(":check user validated:");
    userRepo.load(username)
        .then(row => {
            if (row) {
                if (row.isValidated) {
                    req.user = row;
                    next();
                } else {
                    res.statusCode = 400;
                    res.json({ message: 'user not validated' });
                }

            } else {
                res.statusCode = 400;
                res.json({ message: 'user not exist' });
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.json(config.interal_error(err));
        });

}

