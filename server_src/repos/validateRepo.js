const
user_validate = require('../schemas').user_validate,
sequelize = require('sequelize');

exports.add = (poco) => {
    // {
    //     username : username,
    //     token : string
    // }
    return user_validate.create(poco);
}

exports.loadAll = (opts) => {
    // {
    //     username : username,
    //     token : string
    // }
    return user_validate.findAll({
        where : opts,
        order : [['createdAt','DESC']],
        raw : true
    });
}

exports.create_or_update = (poco) => {
    poco.updatedAt = sequelize.literal('CURRENT_TIMESTAMP');
    return user_validate.upsert(poco,{
        where : {
            username : poco.username
        },
        fields : ['token','updatedAt']
    }); 
}

/**
* 
* @param {object} username 
*/
exports.load = (username) => {
    return user_validate.findOne({
        where : {
            username : username
        },
        raw :true
    });
}