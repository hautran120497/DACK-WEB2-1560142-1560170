const
	express = require('express'),
	sequelize = require('sequelize');

const
	evaluateRepo = require('../../repos/evaluateRepo'),
	userRepo = require('../../repos/userRepo');

const
	router = express.Router();

router.get('/', (req, res) => {
	evaluateRepo.loadAll(req.query)
		.then(row => {
			res.statusCode = 200;
			res.json(row)
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.json({ message: ((err.parent || {}).sqlMessage || 'error')})
		});
});

//evaluate a user
router.post('/',
	(req, res, next) => {
		//register evaluate event
		if (req.body.fromUser && req.body.toUser && req.body.action) {
			//add table
			evaluateRepo.add(req.body)
				.then(row_evaluate => {
					next();
				})
				.catch(err => {
					res.statusCode = 500;
					res.json({ message: ((err.parent || {}).sqlMessage || 'error') });
				});
		} else {
			res.statusCode = 400;
			res.json('missing params error');
		}
	},
	(req, res) => {
		//update user point
		userRepo.update(req.body.toUser, {
			point: sequelize.literal(`point + ${req.body.action}`)
		}).then(changedRows => {
			res.statusCode = 201;
			res.json({ changedRows: changedRows });
		}).catch(err => {
			//add table user_evaluate success
			res.statusCode = 500;
			res.json({ message: ((err.parent || {}).sqlMessage || 'error')});
		});
	});

module.exports = router;