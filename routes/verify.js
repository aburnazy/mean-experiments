var jwt = require('jsonwebtoken');
var config = require('../config');

exports.getToken = function(user) {
	return jwt.sign(user, config.secretKey, {
		expiresIn: 3600
	});
};

var verifyOrdinaryUser = function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if(token) {

		jwt.verify(token, config.secretKey, function(err, decoded) {
			if(err) {
				var err = new Error('You are not authenticated!');
				err.status = 401;
				return next(err);
			} else {
				req.decoded = decoded;

				console.log("Token Decoded");
				console.log(req.decoded);

				next();
			}
		});

	} else {
		var err = new Error('No token provided!');
		err.status = 403;
		return next(err);
	}
};

var verifyAdminUser = function(req, res, next) {
	verifyOrdinaryUser(req, res, function(err) {
		if(err)  return next(err);
		
		if(req.decoded) {
			if(req.decoded._doc.admin) {
					console.log("Admin is authenticated");
					next();
			} else {
				var err = new Error('Only admin is permitted this operation!');
				err.status = 403;
				return next(err);			
			}	
		} else {
			var err = new Error('WTF This Should Not Happen!');
			err.status = 500;
			return next(err);		
		}
	});
};

exports.verifyOrdinaryUser = verifyOrdinaryUser;
exports.verifyAdminUser = verifyAdminUser;