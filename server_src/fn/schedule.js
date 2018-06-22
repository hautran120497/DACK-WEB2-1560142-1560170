const
  sequelize = require('sequelize'),
  productRepo = require('../repos/productRepo'),
  cn = require('../schemas').cn,
  mailRepo = require('../repos/mailRepo'),
  config = require('../config');

var Op = sequelize.Op;

exports.updateProductState = () => {
  cn.query('SELECT * FROM products WHERE \
   (datediff(remainTime, now()) <= 0 AND timediff(remainTime, now()) <= 0) AND isTimeOut = 0',
    { type: sequelize.QueryTypes.SELECT })
    .then((results) => {
      results.forEach((item) => {
        productRepo.update(item.proID, { isTimeOut: 1 })
          .then(changedRows => {
            console.log(`changedRows : ${changedRows}`);
          })
          .catch(err => {
            console.log('update product state error');
            console.log(err);
          })

        if (item.maxBidder) {
          //send email to max bidder
          mailRepo.send_email(item.maxBidder, {
            from: `"X2CANXI" <${config.admin.email}>`,
            subject: "You are win the product",
            html: `Dear <b>${item.maxBidder}</b>, <br>\
                You now are the winner of product <i>"${item.proName}"</i>, \
                please click following link to view details : <br>\
                ${config.webhost}/product_detail?proID=${item.proID} <br>\
                Thank you.<br><b>X2CANXI</b>`
          });
        }

        //send email to seller
        mailRepo.send_email(item.username, {
          from: `"X2CANXI" <${config.admin.email}>`,
          subject: "Your product auction is over",
          html: `Dear <b>${item.username}</b>, <br>\
              The auction of <i>"${item.proName}"</i> is over, \
              please click following link to view details : <br>\
              ${config.webhost}/product_detail?proID=${item.proID} <br>\
              Thank you.<br><b>X2CANXI</b>`
        });
      });
    });
}