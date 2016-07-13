var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var vars = { title: 'Express' };

	if(req.session && req.session.user) {
		var user = req.session.user;
		vars.loggedUser = [user.firstName,user.lastName,user.middleName].join(' ');
	}

 	res.render('index', vars);
});

module.exports = router;
