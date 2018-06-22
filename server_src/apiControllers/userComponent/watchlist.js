const express = require('express');

const watchlistRepo = require('../../repos/watchlistRepo'),
	fn = require('../fn'),
	config = require('../../config');

const router = express.Router();

// users/watchlist
router.get('/', (req, res) => {
	//can filter with query params
	let opts = req.query;
	watchlistRepo.loadAll(opts)
		.then(rows => {
			res.json(rows);
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.json(config.interal_error(err));
		});
});

// users/watchlist/px
router.get('/:username', (req, res) => {
	var opts = {};
	if (!req.params.username) {
		res.statusCode = 400;
		res.json({ message: 'missing username param' });
	} else {
		opts.username = req.params.username;
		if (req.query.proID) {
			opts.proID = req.params.proID;
		}
	}

	watchlistRepo.loadAll(opts)
		.then(rows => {
			res.json(rows);
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.json(config.interal_error(err));
		});
});

// users/px/watchlist
router.post('/:username',
	fn.check_user_exist,
	fn.check_product_exist,
	(req, res) => {
		// body{
		// 	proID : proID
		// }
		let poco = {
			username: req.params.username,
			proID: req.body.proID
		};

		watchlistRepo.add(poco)
			.then(row => {
				res.statusCode = 201;
				res.json(row);
			})
			.catch(err => {
				console.log(err);
				res.statusCode = 500;
				res.json(config.interal_error(err));
			});
	});

module.exports = router;