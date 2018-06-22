const 
express = require('express'),
randomstring = require("randomstring"),
fn = require('../fn');

const 
userRepo = require('../../repos/userRepo'),
mailRepo = require('../../repos/mailRepo');

const router = express.Router();

//users/resetpwd/px
router.put('/:username',
fn.check_user_exist, 
(req, res, next) => {
    //send email contains new password
    let new_password = randomstring.generate(7);
    let user = req.user;
    mailRepo.send_reset_email(user.email,new_password)
    .then(info => {
        req.new_password = new_password;
        next();
    })
    .catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.json({message : 'send email error'});
    });
},
(req, res) => {
    //send mail success, now update password
    userRepo.update(req.params.username,{
        password: req.new_password
    })
    .then(changedRows => {
        res.statusCode = 202;
        res.json({
            message : "sent",
            changedRows : changedRows
        });
    })
    .catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.json({message : 'update password error'});
    });
});

module.exports = router;