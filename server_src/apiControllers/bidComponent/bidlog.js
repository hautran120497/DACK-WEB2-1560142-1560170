const
    express = require('express'),
    axios = require('axios'),
    sequelize = require('sequelize');

const
    bidlogRepo = require('../../repos/bidlogRepo'),
    bidRepo = require('../../repos/bidRepo'),
    productRepo = require('../../repos/productRepo'),
    userRepo = require('../../repos/userRepo'),
    mailRepo = require('../../repos/mailRepo'),
    fn = require('../fn'),
    config = require('../../config');

const router = express.Router();

router.get('/', (req, res) => {
    let opts = req.query;
    bidlogRepo.loadAll(opts)
        .then(rows => {
            res.statusCode = 201;
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.json({ message: 'internal error' });
        });
});

router.delete('/',
    fn.check_product_exist,
    fn.check_user_exist,
    (req, res) => {
        bidlogRepo.delete(req.body)
            .then(changedRows => {
                bidlogRepo.loadMaxBidder(req.body.proID)
                    .then(row => {
                        if (!row) {
                            row = {
                                username: null,
                                price: req.product.initPrice
                            }
                        }
                        //update product
                        productRepo.update(req.body.proID, {
                            maxBidder: row.username,
                            currentPrice: row.price,
                            bidCount: sequelize.literal(`bidCount - ${changedRows}`)
                        }).then(rows => {
                            res.statusCode = 201;
                            res.json({ changedRows: changedRows });
                        }).catch(err => {
                            console.log(err);
                            res.statusCode = 500;
                            res.json({ message: 'internal error' });
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.statusCode = 500;
                        res.json({ message: 'internal error' });
                    });

                //send email to who was kicked
                mailRepo.send_email(req.body.username, {
                    from: `"X2CANXI" <${config.admin.email}>`,
                    subject: "Max Bidder is changed",
                    html: `Dear <b>${req.body.username}</b>,\
                        <br>\
                        You be kicked from product named <i>"${req.product.proName}"</i> by seller, \
                        we are sorry for this.\
                        <br>\
                        Thank you,\
                        <br>\
                        <b>X2CANXI</b>`
                }).then(info => {
                    console.log("email was sent - loser - auto");
                }).catch(err => {
                    console.log("email was not sent - loser - auto");
                });
            })
            .catch(err => {
                console.log(err);
                res.statusCode = 500;
                res.json({ message: 'internal error' });
            });
    });

router.get('/:proID', (req, res) => {
    if (!req.params.proID || isNaN(req.params.proID)) {
        res.statusCode = 400;
        res.json({ message: "price param error" });
    }

    bidlogRepo.loadAll({proID : req.params.proID})
        .then(row => {
            res.statusCode = 201;
            res.json(row);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.json({ message: 'internal error' });
        });
});

router.post('/',
    fn.check_user_exist,
    fn.check_product_exist,
    (req, res, next) => {
        //if no max bidder
        if (!req.product.maxBidder) {
            if (!req.body.username || !req.body.proID || !req.body.maxPrice) {
                res.statusCode = 500;
                res.json({ message: 'missing params require' });
            } else {
                let poco = {
                    username: req.body.username,
                    proID: req.body.proID,
                    price: (req.product.initPrice + req.product.stepPrice)
                }
                bidlogRepo.add(poco)
                    .then(row => {
                        if (row) {
                            req.poco = row;
                            //go update product max bidder
                            next();
                        } else {
                            res.statusCode = 500;
                            res.json({ message: 'add bidlog error' });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.statusCode = 500;
                        res.json({ message: 'internal error' });
                    });
            }
        } else {
            //load max bid info
            bidRepo.load({
                username: req.product.maxBidder,
                proID: req.product.proID
            }).then(lastBid => {
                let newBid = req.body;

                req.poco = {
                    username: newBid.username,
                    proID: newBid.proID
                }
                //set price
                if (newBid.maxPrice <= lastBid.maxPrice) {
                    req.poco.price = newBid.maxPrice
                }
                else {
                    /**
                     * newBid.maxPrice = (N * stepPrice) so if it > lastBid.maxPrice 
                     * => it >= (lastBid.maxPrice + req.product.stepPrice)
                     */
                    req.poco.price = (lastBid.maxPrice + req.product.stepPrice)
                }

                //add bidlog
                bidlogRepo.add(req.poco)
                    .then(row => {
                        //go update product max bidder
                        req.nextBid = lastBid;
                        next();
                    })
                    .catch(err => {
                        console.log(err);
                        res.statusCode = 500;
                        res.json({ message: 'internal error' });
                    });
            }).catch(err => {
                //load max bidder info error
                console.log(err);
                res.statusCode = 500;
                res.json({ message: 'internal error' });
            });
        }

    }, (req, res) => {
        //update new max bidder
        productRepo.update(req.poco.proID, {
            maxBidder: req.poco.username,
            currentPrice: req.poco.price,
            bidCount: sequelize.literal('bidCount + 1')
        }).then(changedRows => {
            console.log({ changedRows: changedRows });
            //send event bid for old max bidder
            if (req.nextBid) {
                axios({
                    method: 'post',
                    url: `${config.serverhost}/bids/bidlog/auto`,
                    data: {
                        username: req.nextBid.username,
                        proID: req.nextBid.proID,
                        maxPrice: req.nextBid.maxPrice
                    }
                }).then(data => {
                    console.log("call auto success");
                }).catch(err => {
                    console.log("call auto failed");
                });
            }

            res.statusCode = 200;
            res.json({ message: "bid success" });
        }).catch(err => {
            res.statusCode = 500;
            res.json({ message: 'internal error' });
        });
    });

// body{
//     username : username,
//     proID : proID,
//     maxPrice : num
// }
router.post('/auto',
    fn.check_product_exist,
    (req, res, next) => {
        /*
         * he is old max bidder
         * if he can't bid
         */
        if (req.body.maxPrice < req.product.currentPrice) {
            //send email to loser
            mailRepo.send_email(req.body.username, {
                from: `"X2CANXI" <${config.admin.email}>`,
                subject: "Max Bidder has changed",
                html: `Dear <b>${req.body.username}</b>, <br>\
                    You are no longer the max bidder of the product <i>"${req.product.proName}"</i>, \
                    please click following link to view details: <br>\
                    ${config.webhost}/product_detail?proID=${req.body.proID} <br>\
                    Thank you. <br><b>X2CANXI</b>`
            }).then(info => {
                console.log("email was sent - loser - auto");
            }).catch(err => {
                console.log("email was not sent - loser - auto");
            });

            res.statusCode = 200;
            res.json({ message: "user can't bid, email should be sent" });
        } else {
            //load current max bidder info
            bidRepo.load({
                username: req.product.maxBidder,
                proID: req.product.proID
            }).then(lastBid => {
                if (req.body.maxPrice == lastBid.maxPrice && req.body.updatedAt > lastBid.updateAt) {
                    //send email to loser
                    mailRepo.send_email(req.body.username, {
                        from: `"X2CANXI" <${config.admin.email}>`,
                        subject: "Max Bidder has changed",
                        html: `Dear <b>${req.body.username}</b>, <br>\
                            You are no longer the max bidder of the product <i>"${req.product.proName}"</i>, \
                            please click following link to view details: <br>\
                            ${config.webhost}/product_detail?proID=${req.body.proID} <br>\
                            Thank you. <br><b>X2CANXI</b>`
                    }).then(info => {
                        console.log("send email success - loser - auto");
                    }).catch(err => {
                        console.log("send email failed - loser - auto");
                    });

                    res.statusCode = 200;
                    res.json({ message: "user can't bid, email should be sent" });
                } else {
                    //add new bidlog
                    req.lastBid = lastBid;
                    next();
                }
            }).catch(err => {
                console.log(err);
                res.statusCode = 500;
                res.json({ message: 'load last bid user error' });
            });
        }
    }, (req, res) => {
        //add bidlog
        var poco = {
            username: req.body.username,
            proID: req.body.proID,
            price: req.body.maxPrice
        };

        bidlogRepo.add(poco)
            .then(bidlog => {
                productRepo.update(poco.proID, {
                    maxBidder: poco.username,
                    currentPrice: poco.price
                }).then(changedRows => {
                    //send email to max bidder
                    mailRepo.send_email(poco.username, {
                        from: `"X2CANXI" <${config.admin.email}>`,
                        subject: "Bid Success",
                        html: `Dear <b>${poco.username}</b>, <br>\
                            You are now the max bidder of the product <i>"${req.product.proName}"</i>, \
                            please click following link to view details : <br>\
                            ${config.webhost}/product_detail?proID=${req.body.proID} <br>\
                            Thank you. <br><b>X2CANXI</b>`
                    }).then(info => {
                        console.log("send email success - winner - auto");
                    }).catch(err => {
                        console.log("send email failed - winner - auto");
                    });

                    //send event bid for old max bidder
                    axios({
                        method: 'post',
                        url: `${config.serverhost}/bids/bidlog/auto`,
                        data: {
                            username: req.lastBid.username,
                            proID: req.lastBid.proID,
                            maxPrice: req.lastBid.maxPrice
                        }
                    }).then(data => {
                        console.log("last call to loser success");
                    }).catch(err => {
                        console.log("last call to loser failed");
                    });

                    res.statusCode = 200;
                    res.json({ message: "bid success" });
                }).catch(err => {
                    console.log(err);
                    res.statusCode = 500;
                    res.json({ message: 'update new max bidder error' });
                });
            })
            .catch(err => {
                //add bidlog error
                console.log(err);
                res.statusCode = 500;
                res.json({ message: 'add bidlog error' });
            });
    });
module.exports = router;