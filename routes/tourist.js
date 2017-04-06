var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('tourist/index');
});

/* GET page1 page. */
router.get('/page1.html', function(req, res) {
	res.render('tourist/page1');
});

/* GET page2 page. */
router.get('/page2.html', function(req, res) {
	res.render('tourist/page2');
});

module.exports = router;