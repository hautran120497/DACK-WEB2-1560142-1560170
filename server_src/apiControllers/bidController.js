const
	axios = require('axios'),
	express = require('express');

const
	bidRepo = require('../repos/bidRepo'),
	userRepo = require('../repos/userRepo'),
	bidlogRepo = require('../repos/bidlogRepo'),
	config = require('../config'),
	mailRepo = require('../repos/mailRepo'),
	productRepo = require('../repos/productRepo'),
	fn = require('./fn'),
	sequelize = require('sequelize');

const
	kickComp = require('./bidComponent/kick'),
	bidlogComp = require('./bidComponent/bidlog');

var router = express.Router();

router.use('/kick', kickComp);
router.use('/bidlog', bidlogComp);

router.get('/', (req, res) => {
	var opts = {};

	//username
	if (req.query.username) {
		opts.username = req.query.username;
	}

	//product id
	if (req.query.proID) {
		if (isNaN(req.query.proID)) {
			res.statusCode = 400;
			res.json({ message: 'proID is not a number' });
		}
		opts.proID = req.query.proID;
	}

	bidRepo.loadAll(opts)
		.then(rows => {
			res.json(rows);
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.json(config.interal_error(err));
		});
});

router.delete('/', (req, res) => {
	if (!req.body.username || !req.body.proID) {
		res.statusCode = 400;
		res.json({ message: 'missing params required' });
	}

	var opts = req.body;
	bidRepo.delete(opts)
		.then(changedRows => {
			res.statusCode = 200;
			res.json({ changedRows: changedRows });
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.json(config.interal_error(err));
		});
});

router.post('/',
	fn.check_user_exist,
	fn.check_product_exist,
	(req, res, next) => {
		//check maxPrice params
		if (!req.body.maxPrice) {
			res.statusCode = 400;
			res.json({ message: 'missing maxPrice param' });
		}

		if (isNaN(req.body.maxPrice)) {
			res.statusCode = 400;
			res.json({ message: 'maxPrice is not a number' });
		}

		//check maxPrice > currentPrice + step
		if (req.body.maxPrice < (req.product.currentPrice + req.product.stepPrice)) {
			res.statusCode = 400;
			res.json({ message: 'maxPrice not valid' });
		}

		console.log(":upsert bid:");
		bidRepo.upsert(req.body)
			.then(isCreated => {
				//send email to seller
				mailRepo.send_email(req.product.username, {
					from: `"X2CANXI" <${config.admin.email}>`,
					subject: "Someone Was Bid Your Product",
					html: `Dear <b>${req.product.username}</b>, <br>\
						The max bidder of the product <i>"${req.product.proName}"</i> is updated, \
						please click following link to view details: <br>
						${config.webhost}/product_detail?proID=${req.product.proID} <br>\
						Thank you. <br><b>X2CANXI</b>`
				}).then(info => {
					console.log(info);
				}).catch(err => {
					console.log(err);
				});

				//send email to max bidder
				mailRepo.send_email(req.body.username, {
					from: `"X2CANXI" <${config.admin.email}>`,
					subject: "Max Bidder is changed",
					html: `Dear <b>${req.body.username}</b>,<br>\
						You are now the max bidder of the product <i>"${req.product.proName}"</i>, \
						please click following link to view details:<br>\
						${config.webhost}/product_detail?proID=${req.product.proID}<br>\
						Thank you.<br><b>X2CANXI</b>`
				}).then(info => {
					console.log(info);
				}).catch(err => {
					console.log(err);
				});

				//autoRemain
				if (req.product.autoRenewal) {
					var times = req.product.remainTime - Date.now();
					var _5minute = 1000 * 60 * 5;
					var _10minute = 1000 * 60 * 10;
					if (times > 0 && times <= _5minute) {
						var newTime = new Date(req.product.remainTime.getTime() + _10minute);
						productRepo.update(req.product.proID, {
							remainTime: newTime
						});
					}
				}

				//load data to send bidlog controller
				bidRepo.load({ username: req.body.username, proID: req.body.proID })
					.then(row => {
						if (row) {
							//send event bid for old max bidder
							axios({
								method: 'post',
								url: `${config.serverhost}/bids/bidlog`,
								data: row
							}).then(data => {
								console.log("call to loser success: " + data);
							}).catch(err => {
								console.log("call to loser failed: " + err);
							});

							res.statusCode = 201;
							res.json({ message: "bid success: " });
						} else {
							res.statusCode = 500;
							res.json(config.interal_error(err));
						}
					})
					.catch(err => {
						console.log(err);
						res.statusCode = 500;
						res.json(config.interal_error(err));
					});
			})
			.catch(err => {
				console.log(err);
				res.statusCode = 500;
				res.json(config.interal_error(err));
			});
	});


router.post('/oneshot',
	fn.check_user_exist,
	fn.check_product_exist,
	(req, res) => {
		if(!req.product.shotPrice){
			res.statusCode = 401;
			res.json({ message: 'shot price is not exist' });
		} else if (req.product.shotPrice <= req.product.currentPrice) {
			res.statusCode = 401;
			res.json({ message: 'shot price now lower than current price' });
		}else{
		var poco = {
			username: req.body.username,
			proID: req.body.proID,
			maxPrice: req.product.shotPrice
		}
		bidRepo.upsert(poco)
			.then(isCreated => {
				//send email to seller
				mailRepo.send_email(req.product.username, {
					from: `"X2CANXI" <${config.admin.email}>`,
					subject: "Your product is selled",
					html: `Dear <b>${req.product.username}</b>, <br>\
							Your product <i>"${req.product.proName}"</i> has selled, \
							please click following link to view details: <br>
							${config.webhost}/product_detail?proID=${req.product.proID} <br>\
							Thank you. <br><b>X2CANXI</b>`
				}).then(info => {
					console.log(info);
				}).catch(err => {
					console.log(err);
				});

				//send email to max bidder
				mailRepo.send_email(req.body.username, {
					from: `"X2CANXI" <${config.admin.email}>`,
					subject: "You win the product",
					html: `Dear <b>${req.body.username}</b>,<br>\
							You are now the winner of product <i>"${req.product.proName}"</i> \
							with price <u>${req.product.shotPrice}</u>, \
							please click following link to view details:<br>\
							${config.webhost}/product_detail?proID=${req.product.proID}<br>\
							Thank you.<br><b>X2CANXI</b>`
				}).then(info => {
					console.log(info);
				}).catch(err => {
					console.log(err);
				});

				var poco = {
					username: req.body.username,
					proID: req.body.proID,
					price: req.product.shotPrice
				}

				bidlogRepo.add(poco)
					.then(row => {
						//update new max bidder
						productRepo.update(req.body.proID, {
							maxBidder: req.body.username,
							currentPrice: req.body.maxPrice,
							bidCount: sequelize.literal('bidCount + 1'),
							isTimeOut: 1,
							remainTime: Date.now()
						}).then(changedRows => {
							res.statusCode = 200;
							res.json({ message: "bid success" });
						}).catch(err => {
							res.statusCode = 500;
							res.json({ message: 'internal error' });
						});
					})
					.catch(err => {
						console.log(err);
						res.statusCode = 500;
						res.json(config.interal_error(err));
					});
			})
			.catch(err => {
				console.log(err);
				res.statusCode = 500;
				res.json(config.interal_error(err));
			});
		}
	});
module.exports = router;