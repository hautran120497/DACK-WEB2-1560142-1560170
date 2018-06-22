const user_evaluate = require('../schemas').user_evaluate;

exports.loadAll = (opts) => {
    return user_evaluate.findAll({
        where : opts,
        order : [['createdAt','DESC']],
        raw : true
    });
}

exports.load = (fromUser, toUser) => {
    // {
    //     fromUser : username,
    //     toUser : username
    // }
    return user_evaluate.loadOne({
        where : {
            fromUser : fromUser,
            toUser : toUser
        },
        raw : true
    });
}

exports.add = (poco) => {
    return user_evaluate.create(poco);
}