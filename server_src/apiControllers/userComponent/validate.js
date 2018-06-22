const 
express = require('express'),
randomstring = require("randomstring"),
config = require('../../config'),
fn = require('../fn');

const 
validateRepo = require('../../repos/validateRepo'),
userRepo = require('../../repos/userRepo'),
mailRepo = require('../../repos/mailRepo');

const router = express.Router();

router.get('/', (req, res) => {
	validateRepo.loadAll(req.params)
	.then(rows => {
		res.json(rows);
	})
	.catch(err => {
		console.log(err);
		res.statusCode = 500;
		res.json(config.interal_error(err));
	});
});

//send email for validate a user
router.post('/:username',
fn.check_user_exist, 
(req, res, next) => {
	//check if user isValidated
	userRepo.load(req.params.username)
	.then(user => {
		if(user.isValidated){
			res.statusCode = 202;
			res.json('account had already validated!');
		}else{
			next();
		}
	})
	.catch(err => {
		console.log(err);
		res.statusCode = 500;
		res.json(config.interal_error(err));
	});
},
(req, res) => {
	//add data to user_validate
	var poco = {
		username :req.user.username,
		token : randomstring.generate(21)
	};
	
	validateRepo.create_or_update(poco)
	.then((is_created) => {
		poco.email = req.user.email;
		mailRepo.send_validate_email(poco)
		.then(info => {
			res.statusCode = 201;
			res.json('sent');
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.json('sending error');
		});
	})
	.catch(err => {
		//add table user_evaluate failed
		console.log(err);
		res.statusCode = 500;
		res.json(config.interal_error(err));
	});
});

//validate a user
router.get('/:username', (req, res, next) => {
	if(req.query.token && req.params.username){
		let token = req.query.token;
		
		validateRepo.load(req.params.username)
		.then(row => {
			let timeSendEmail = new Date(row.updatedAt);
			let timeNow = Date.now();
			let distance = Math.abs(timeNow - timeSendEmail.getTime());
			if(token == row.token && distance <= config.time_email_validate_expired){
				next();
			}else{
				res.statusCode = 408;
				res.end('Your validate request is timeout, please send reset password request again!');
			}
		}).catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.json(config.interal_error(err));
		});
	}else{
		res.statusCode = 400;
		res.json('missing params error');
	}
},
(req, res) => {
	//validated, now update account status
	userRepo.update(req.params.username,{
		isValidated : true
	}).then(changedRows => {
		res.statusCode = 202;
		res.end('Your account was validated successfull, now you can login!');
	})
	.catch(err => {
		console.log(err);
		res.statusCode = 500;
		res.json(config.interal_error(err));
	});
});

module.exports = router;