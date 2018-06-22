const category = require('../schemas').category,
sequelize = require('sequelize');

const Op = sequelize.Op;

exports.loadAll = (keyword) => {
	// opts{
	// 	keyword : string
	// }
		return category.findAll({
			where :{
				catName : {
					[Op.like] : `%${keyword}%`
				}
			},
			order : [['createdAt','DESC']],
			raw : true
		});
}

exports.load = (catID) => {
	return category.findById(catID, {
		raw: true
	});
}

exports.add = (poco) => {
	// poco{
	// 	name : name
	// }
	return category.create(poco);
}

exports.update = (catID, poco) => {
	// poco{
	// 	name : name
	// }
	return category.update(poco, {
		where : {
			catID : catID
		}
	});
}

exports.delete = (catID) => {
	// poco{
	// 	id : 1
	// }
	return category.destroy({
		where : {
			catID : catID
		}
	});
}



