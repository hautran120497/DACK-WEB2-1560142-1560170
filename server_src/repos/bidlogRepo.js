const bidlog = require('../schemas').bidlog;

/**
 * 
 * @param {object} opts 
 * {
 *  username : username,
 *  proID : proID
 * }
 */
exports.loadAll = (opts) => {
    return bidlog.findAll({
        where : opts,
        order : [['id','DESC']],
        raw : true
    })
}

/**
 * 
 * @param {object} poco 
 * {
 *  username : username,
 *  proID : proID,
 *  price : number
 * }
 */
exports.add = (poco) => {
    return bidlog.create(poco);
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
    return bidlog.destroy({
        where : {
            username : opts.username,
            proID : opts.proID
        }
    });
}

exports.loadMaxBidder = (proID) => {
	return bidlog.findOne({
        where: {
            proID : proID
        },
        order : [['price','DESC'],['updatedAt','ASC']],
        raw: true
    });
}