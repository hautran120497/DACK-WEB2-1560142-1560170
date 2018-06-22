const
	express = require('express'),
	axios = require('axios');

const kickRepo = require('../../repos/kickRepo'),
	fn = require('../fn'),
	config = require('../../config');

const router = express.Router();

router.get('/',
	(req, res) => {
		var opts = req.query;

		kickRepo.loadAll(opts)
			.then(rows => {
				res.statusCode = 201;
				res.json(rows);
			})
			.catch(err => {
				console.log(err);
				res.statusCode = 500;
				res.json({ message: err.parent.sqlMessage || 'error' });
			});
	});

router.delete('/', (req, res) => {
	if (!req.body.username || !req.body.proID) {
		res.statusCode = 400;
		res.json({ message: 'missing params required' });
	} else {
		let opts = req.body;
		kickRepo.delete(opts)
			.then(changedRows => {
				res.statusCode = 201;
				res.json({ changedRows: changedRows });
			})
			.catch(err => {
				console.log(err);
				res.statusCode = 500;
				res.json(config.interal_error(err));
			});
	}
});

//api/kickout
//body{ username, proID }
router.post('/',
	fn.check_user_exist,
	fn.check_product_exist,
	(req, res) => {
		//kicking
		kickRepo.kick(req.body)
			.then(row => {
				//delete bid data
				axios({
					method: 'delete',
					url: `${config.serverhost}/bids`,
					data: row
				}).then(info => {
					console.log("delete bid success");
				}).catch(err => {
					console.log("delete bid failed");
				});

				//delete bid log data
				axios({
					method: 'delete',
					url: `${config.serverhost}/bids/bidlog`,
					data: row
				}).then(info => {
					console.log("delete bidlog success");
				}).catch(err => {
					console.log("delete bidlog failed");
				});

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