const
	express = require('express'),
	fn = require('../fn'),
	config = require('../../config'),
	sequelize = require('sequelize');

const gainvipRepo = require('../../repos/gainvipRepo');
const userRepo = require('../../repos/userRepo');

const router = express.Router();

// get user gainvip request list
router.get('/', (req, res) => {
	//add optine to query if you want
	req.query.isAccepted = null;
	gainvipRepo.loadAll(req.query)
		.then(rows => {
			res.statusCode = 200;
			res.json(rows);
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.json(config.interal_error(err));
		});
});

// users/gainvip/px
router.post('/:username',
	fn.check_user_exist,
	(req, res) => {
		//register gain vip request	
		gainvipRepo.upsert({
			username: req.params.username
		})
			.then(isAccepted => {
				res.statusCode = 202;
				res.json({message : "success"});
			})
			.catch(err => {
				console.log(err);
				res.statusCode = 500;
				res.json(config.interal_error(err));
			});
	});

// accept/deny user gainvip request
router.put('/:username',
	fn.check_user_exist,
	(req, res, next) => {
		//body{
		//    isAccepted : 1/0
		//}
		gainvipRepo.update(req.params.username, {
			isAccepted: req.body.isAccepted 
		})
			.then(changedRows => {
				next();
			})
			.catch(err => {
				console.log(err);
				res.statusCode = 500;
				res.json(config.interal_error(err));
			});
	},
	(req, res) => {
		//update user vip status
		userRepo.update(req.params.username, {
			gainvipAt: req.body.isAccepted ? Date.now() : null
		})
			.then(changedRows => {
				res.statusCode = 201;
				res.json({ changedRows: changedRows });
			})
			.catch(err => {
				console.log(err);
				res.statusCode = 500;
				res.json(config.interal_error(err));
			})
	});

module.exports = router;