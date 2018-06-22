var express = require('express'),
	categoryRepo = require('../repos/categoryRepo'),
	config = require('../config');

var router = express.Router();

router.get('/', (req, res) => {
	var keyword = '';
	if (req.query.keyword) {
		keyword = req.query.keyword;
	}

	categoryRepo.loadAll(keyword).then(rows => {
		res.json(rows);
	}).catch(err => {
		console.log(err);
		res.statusCode = 500;
		res.json(config.interal_error(err));
	});
});

// categories/5
router.get('/:catID', (req, res) => {
	if (req.params.catID) {
		var catID = req.params.catID;

		if (isNaN(catID)) {
			res.statusCode = 400;
			res.json({ message: 'param type error' });
		}

		categoryRepo.load(catID).then(row => {
			if (row) {
				res.json(row);
			} else {
				res.statusCode = 204;
				res.json({ message: 'not found' });
			}
		}).catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.json(config.interal_error(err));
		});
	} else {
		res.statusCode = 400;
		res.json({ message: 'missing params error' });
	}
});

router.post('/', (req, res) => {
	categoryRepo.add(req.body)
		.then(json => {
			// var poco = {
			// 	catcatID: insertcatID,
			// 	catName: req.body.CatName
			// };
			res.statusCode = 201;
			res.json(json);
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.json(config.interal_error(err));
		});
});

router.delete('/:catID', (req, res) => {
	if (req.params.catID) {
		var catID = req.params.catID;

		if (isNaN(catID)) {
			res.statusCode = 400;
			res.json('params type error');
		}

		categoryRepo.delete(catID).then(affectedRows => {
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
		res.json({ message: 'missing params error' });
	}
});

router.put('/:catID', (req, res) => {
	if (req.params.catID) {
		var catID = req.params.catID;

		if (isNaN(catID)) {
			res.statusCode = 400;
			res.json('params type error');
		}

		categoryRepo.update(catID, req.body)
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
		res.json({ message: 'missing params error' });
	}
});

module.exports = router;