var bid = require('../schemas').bid,
sequelize = require('sequelize');

/**
* 
* @param {option use for search} opts 
*/
exports.loadAll = (opts) => {
    // opts { 
    //  username:username 
    //  proID: id
    //  }
	return bid.findAll({
        where: opts,
        order : [['id','DESC']],
        raw: true
	});
}

exports.load = (opts) => {
    // opts { 
    //  username:username 
    //  proID: id
    //  }
	return bid.findOne({
        where: opts,
        raw: true
    });
}
/**
* 
* @param {json} poco json
* @returns {boolean} 1 when created and 0 when updated
*/
exports.upsert = (poco) => {
    poco.updatedAt = sequelize.literal('CURRENT_TIMESTAMP');
    return bid.upsert(poco,{
        where : {
            username: poco.username,
            proID: poco.proID
        },
        fields:['maxPrice','updatedAt']
    });
}

/**
 * 
 * @param {object} opts 
 * {
 *  username : username,
 *  proID : proID
 * }
 */
exports.delete = (opts) => {
    return bid.destroy({
        where : {
            username : opts.username,
            proID : opts.proID
        }
    });
}