var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index');
});

/* GET page1 page. */
router.get('/page1', function(req, res) {
	res.render('page1');
});

/* GET page2 page. */
router.get('/page2', function(req, res) {
	res.render('page2');
});

module.exports = router;