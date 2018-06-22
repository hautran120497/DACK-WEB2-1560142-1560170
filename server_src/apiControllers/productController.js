const
	express = require('express'),
	sequelize = require('sequelize'),
	multer = require('multer'),
	mkdirp = require('mkdirp'),
	fs = require('fs'),
	axios = require('axios');

const
	productRepo = require('../repos/productRepo'),
	fn = require('./fn'),
	config = require('../config');

const Op = sequelize.Op;

const imageComp = require('./productComponent/image');

const router = express.Router();

router.use('/image',imageComp);

router.get('/', (req, res) => {
	var opts = {};

	//limit
	if (req.query.limit) {
		let limit = req.query.limit;
		if (isNaN(limit)) {
			res.statusCode = 400;
			res.json({ message: 'params type error' });
			return;
		} else {
			opts.limit = parseInt(limit);
		}
	}

	//offset
	if (req.query.offset) {
		var offset = req.query.offset;
		if (isNaN(offset)) {
			res.statusCode = 400;
			res.json('params type error');
			return;
		} else {
			opts.offset = parseInt(offset);
		}
	}

	//order column
	if (req.query.order) {
		opts.order = [[req.query.order]];

		//sort way
		if (req.query.sort) {
			var sort = req.query.sort;
			if (sort == "asc" || sort == "desc") {
				opts.order[0].push(sort);
			}
		}
	}

	opts.where = {};
	//keyword for searching
	if (req.query.keyword) {
		opts.where.proName = {
			[Op.like]: `%${req.query.keyword}%`
		};
	}

	//filter with catID
	if (req.query.catID) {
		opts.where.catID = req.query.catID;
	}


	//filter with seller
	if (req.query.username) {
		opts.where.username = req.query.username;
	}


	//filter with max bidder
	if (req.query.maxBidder) {
		opts.where.maxBidder = req.query.maxBidder;
	}

	//filter with isTimeOut
	if (req.query.isTimeOut) {
		opts.where.isTimeOut = req.query.isTimeOut;
	}else{
		if(req.query.nearend){
			opts.where.isTimeOut = 0;
		}
	}

	//filter with near end
	if(req.query.nearend){
		var q1 = sequelize.literal('DATEDIFF(remainTime, now())');
		var q2 = sequelize.literal('TIMEDIFF(remainTime, now())');
		if(!opts.order) opts.order = [];
		opts.order.push([q1,'ASC']);	
		opts.order.push([q2,'ASC']);	
	}

	productRepo.loadAll(opts).then((rows) => {

		res.json(rows);
	}).catch(err => {
		console.log(err);
		res.statusCode = 500;
		res.json(config.interal_error(err));
	});
});

// products/1
router.get('/:proID', (req, res) => {
	if (req.params.proID) {
		var proID = req.params.proID;

		if (isNaN(proID)) {
			res.statusCode = 400;
			res.json('params type error');
		}

		productRepo.load(proID).then(row => {
			if (row) {
				//send req to product/image
				axios({
					method: 'get',
					url: `${config.serverhost}/products/image/${proID}`,
				}).then(data => {
					if(data){
						row.images = data.data.images;
						res.json(row);
					}else{
						res.json(row);
					}
				}).catch(err => {
					console.log(err);
					console.log("get image error");
					res.statusCode = 500;
					res.json(row);
				});
			} else {
				//no content
				res.statusCode = 204;
				res.json('no content');
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


var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		var dir = `./public/image/products/temp`;
		mkdirp(dir, function (err) {
			cb(err, dir);
		});
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
});

var upload = multer({
	storage: storage
});

router.post('/',
	upload.array('photos', 7),
	fn.check_user_exist,
	(req, res) => {
		//check params
		if (!req.body.proName
			|| !req.body.catID
			|| !req.body.username
			|| !req.body.initPrice
			|| !req.body.stepPrice
			|| !req.body.description
			|| !req.body.remainTime
		) {
			res.statusCode = 400;
			res.json({ message: 'missing params require' });
		} else {
			if(req.body.autoRenewal) req.body.autoRenewal = 1;
			req.body.currentPrice = req.body.initPrice;
			productRepo.add(req.body)
				.then(row => {
					fs.rename('./public/image/products/temp', `./public/image/products/${row.proID}`, function (err) {
						if (err) console.log(err);
						else console.log('renamed complete');
					});
					res.statusCode = 201;
					res.json(row);
				})
				.catch(err => {
					console.log(err);
					res.statusCode = 500;
					res.json(config.interal_error(err));
				});
		}
	});

router.put('/:proID', (req, res) => {
	if (req.params.proID && req.body) {
		var proID = req.params.proID;

		if (isNaN(proID)) {
			res.statusCode = 400;
			res.json({ message: 'params type error' });
			return;
		} else {
			if (req.body.description) {
				let add_description = req.body.description;
				req.body.description = sequelize.literal(`description + \
				'<br>EDIT (${Date.now()})<br>' + ${add_description}`)
			}
			productRepo.update(proID, req.body)
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
		}
	} else {
		res.statusCode = 400;
		res.json({ message: 'missing params error' });
	}
});

module.exports = router;