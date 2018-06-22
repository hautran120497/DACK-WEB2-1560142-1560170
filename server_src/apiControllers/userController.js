const express = require('express'),
	email_validator = require('email-validator');

const userRepo = require('../repos/userRepo'),
	config = require('../config');

const router = express.Router();

const
	validateComp = require('./userComponent/validate'),
	evaluateComp = require('./userComponent/evaluate'),
	watchlistComp = require('./userComponent/watchlist'),
	resetpwdComp = require('./userComponent/resetpwd'),
	gainvipComp = require('./userComponent/gainvip');

router.use('/validate', validateComp);
router.use('/evaluate', evaluateComp);
router.use('/watchlist', watchlistComp);
router.use('/resetpwd', resetpwdComp);
router.use('/gainvip', gainvipComp);

router.get('/', (req, res) => {
	userRepo.loadAll().then(rows => {
		res.statusCode = 200;
		res.json(rows);
	}).catch(err => {
		console.log(err);
		res.statusCode = 500;
		res.end(err.name);
	});
});

// users/1
router.get('/:username', (req, res) => {
	if (req.params.username) {
		let username = req.params.username;

		userRepo.load(username).then(row => {
			if (row) {
				res.json(row);
			} else {
				//no content
				res.statusCode = 204;
				res.json({message : 'no content'});
			}
		}).catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.json(config.interal_error(err));
		});
	} else {
		res.statusCode = 400;
		res.json('error');
	}
});

router.post('/', (req, res) => {
	if (!(req.body.username && req.body.password && req.body.email)) {
		res.statusCode = 400;
		res.json({message : 'params missing error'});
	}

	//email not valid
	if (!email_validator.validate(req.body.email)) {
		res.statusCode = 400;
		res.json({message : 'email not valid'});
	}

	if(req.body.password.length < 6){
		res.statusCode = 400;
		res.json({message : 'password lower 6 characters'});
	}

	userRepo.add(req.body)
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

router.delete('/:username', (req, res) => {
	if (req.params.username) {
		let username = req.params.username;

		userRepo.delete(username).then(affectedRows => {
			res.json({
				affectedRows: affectedRows
			});
		}).catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.json(config.interal_error(err));
		});
	} else {
		res.statusCode = 400;
		res.json({message : 'params missing error'});
	}
});

router.put('/:username', (req, res) => {
	if (req.params.username) {
		let username = req.params.username;
		userRepo.update(username, req.body)
			.then(changedRows => {
				res.statusCode = 202;
				res.json({
					changedRows: changedRows
				});
			})
			.catch(err => {
				console.log(err);
				res.statusCode = 500;
				res.json(config.interal_error(err));
			});
	} else {
		res.statusCode = 400;
		res.json({ message: 'params missing error' });
	}
});

module.exports = router;
