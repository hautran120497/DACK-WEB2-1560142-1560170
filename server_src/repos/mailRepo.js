'use strict';
const nodemailer = require('nodemailer'),
    userRepo = require('../repos/userRepo'),
    q = require("q"),
    config = require('../config');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.admin.email,
        pass: config.unlock(config.admin.lockword)
    }
});

exports.send_reset_email = (emailUser, newPassword) => {
    var d = q.defer();

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"X2CANXI" <pax.artics@gmail.com>', // sender address
        to: emailUser, // list of receivers
        subject: '[X2CANXI] Reset Password', // Subject line
        html: `Your new password is <b>${newPassword}</b>, remember change your password after login!` // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            d.reject(error);
        } else {
            d.resolve(info);
        }
    });

    return d.promise;
}

exports.send_validate_email = (poco) => {
    // {
    //     username : username,
    //     email : email@gmail.com
    //     token : string
    // }
    var d = q.defer();

    let url_validate = `${config.serverhost}/users/validate/${poco.username}/?token=${poco.token}`;

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"X2CANXI" <pax.artics@gmail.com>', // sender address
        to: poco.email, // list of receivers
        subject: '[X2CANXI] Active Account', // Subject line
        html: `Click the following link to active your account: ${url_validate}` // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            d.reject(error);
        } else {
            d.resolve(info);
        };
    });

    return d.promise;
}

exports.send_email = (username, mailOptions) => {
    var d = q.defer();

    userRepo.load(username)
        .then(row => {
            if (row) {
                mailOptions.to = row.email;
                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        d.reject(error);
                    } else {
                        d.resolve({message : "Sent"});
                    };
                });
            }else{
                d.reject({message : "user not exist"});
            }
        })
        .catch(err => {
            d.reject({message : "load user error"});
        });

    return d.promise;
}