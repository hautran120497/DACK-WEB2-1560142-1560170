const kickout = require('../schemas').kickout;

/**
 * @param {object} opts { username: username, proID: id}
 * @returns objects[{}]
 */
exports.loadAll = (opts) => {
	return kickout.findAll({
        where: opts,
        raw: true
	});
}

/**
 * @param {object} opts { username: username, proID: id}
 * @returns object{}
 */
exports.load = (opts) => {
	return kickout.findOne({
        where: opts,
        raw: true
	});
}

/**
 * @param {object} opts { username: username, proID: id}
 * @returns object{}
 */
exports.delete = (opts) => {
	return kickout.destroy({
        where: opts
	});
}

/**
* 
* @param {object} poco 
* {
*   username:username,
*   proID:id
* }
* @returns object{}
*/
exports.kick = (poco) => {
    return kickout.create(poco);
}