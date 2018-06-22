const user = require('../schemas').user;
const md5 = require('md5');



exports.loadAll = (opts) => {
	return user.findAll({
		where : opts,
		order : [['createdAt','DESC']],
		raw: true
	});
}

exports.load = (username) => {
	return user.findOne({
		where: {
			username : username
		},
		raw: true 
	});
}

exports.add = (poco) => {
	poco.password = md5(poco.password);
	return user.create(poco);
}

exports.update = (username, poco) => {
	if(poco.password){
		poco.password = md5(poco.password);
	}
	return user.update(poco, {
		where : {
			username : username
		}
	});
}

exports.delete = (username) => {
	return user.destroy({
		where : {
			username : username
		}
	});
}

