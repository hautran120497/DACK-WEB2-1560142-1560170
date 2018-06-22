const watchlist = require('../schemas').watchlist;
/**
 * @param {*} poco 
 * { 
 *  username:username 
 *  proID: id
 * }
 */
exports.add = (poco) => {
	return watchlist.create(poco);
}

/**
 * @param {*} opts 
 * { 
 *  username:username 
 *  proID: id
 * }
 */
exports.loadAll = (opts) => {
	return watchlist.findAll({
		where:opts,
		order : [['createdAt','DESC']],
		raw: true
	});
}

/**
 * @param {string} username 
 */
exports.load = (username) => {
	return watchlist.findAll({
		where:{
            username : username
        },
		raw: true
	});
}