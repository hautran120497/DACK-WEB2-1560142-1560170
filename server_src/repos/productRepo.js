const product = require('../schemas').product,
sequelize = require('sequelize');

const Op = sequelize.Op;

// 	{
//     "createdAt": {
//         "val": "CURRENT_TIMESTAMP"
//     },
//     "updatedAt": {
//         "val": "CURRENT_TIMESTAMP"
//     },
//     "isTimeOut": "0",
//     "proID": 1,
//     "proName": "name",
//     "catID": 1,
//     "initPrice": 100000,
//     "stepPrice": 1000,
//     "shotPrice": 200000,
//     "description": "string",
//     "autoRenewal": 0,
//     "remainTime": "2018-06-02T06:00:00.000Z"
// }

exports.loadAll = (opts) => {
	// opts{
	// 		limit: 3,
	// 		offset: 2,
	// 		order: [['column','ASC']]
	// }
	opts.raw = true;
	return product.findAll(opts);
}

exports.load = (proID) => {
	return product.findOne({
		where :{
			proID : proID
		},
		raw: true
	});
}

exports.add = (poco) => {	
	return product.create(poco);
}

exports.update = (proID, poco) => {
	return product.update(poco, {
		where : {
			proID : proID
		}
	});
}

exports.updateAll = (opts, poco) => {
	return product.update(poco, opts);
}

exports.delete = (proID) => {
	return product.destroy({
		where : {
			proID : proID
		}
	});
}



