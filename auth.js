var USERNAME = 'admin';
var PASSWORD = 'Qw123456';

function auth(req, res, next) {
	console.log("Authorization: ");
	console.log(req.headers);

	if(!req.signedCookies.user) {
		var authHeader = req.headers.authorization;
		if(!authHeader) {
			var err = new Error('You are not authenticated!!');
			err.status = 401;
			next(err);
			return;
		}

		var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(":");
		if(auth[0] != USERNAME || auth[1] != PASSWORD) {
			var err = new Error('Provided credentials are not correct. You are not authenticated!!');
			err.status = 401;
			next(err);
			return;
		}

		res.cookie('user', 'admin', {'signed': true});	
		req.session.user = { firstName: 'Garegin', middleName: 'B', lastName: 'Catholicos' };
		next(); //authorized
	} else {
		if(req.signedCookies.user == 'admin') {
			console.log("Authorized by cookie");
			console.log("From session");
			console.log(req.session);
			next(); //authorized
		} else {
			var err = new Error('You are not authenticated!!');
			err.status = 401;
			next(err);
			return;			
		}

	}
}

module.exports = auth;