const
    express = require('express'),
    fs = require('fs');

const router = express.Router();

router.get('/:proID', (req, res) => {
    fs.readdir(`./public/image/products/${req.params.proID}`, (err, files) => {
        if (err) console.log(err);
        res.statusCode = 200;
        res.json({images : files});
    });
});

module.exports = router;