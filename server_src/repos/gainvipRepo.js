const
	gainvip = require('../schemas').gainvip,
	sequelize = require('sequelize');

// poco{
//   username : username,
//   isAccepted : 0/1
// }

exports.upsert = (poco) => {
	poco.updatedAt = sequelize.literal('CURRENT_TIMESTAMP');
	poco.isAccepted = null;
	return gainvip.upsert(poco, {
		where: {
			username: poco.username
		},
		fields: ['isAccepted', 'updatedAt']
	});
}

exports.loadAll = (opts) => {
	return gainvip.findAll({
		where: opts,
		order: [['createdAt', 'DESC']],
		raw: true
	});
}

exports.load = (opts) => {
	return gainvip.findOne({
		where: opts,
		raw: true
	});
}

exports.update = (username, poco) => {
	return gainvip.update(poco, {
		where: {
			username: username
		}
	});
}
