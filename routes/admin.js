var express = require('express');

var Quiz = require('../models/quizzes');
var Verify = require('./verify');

var router = express.Router();

/* GET users listing. */
router.route('/')
.post(Verify.verifyAdminUser, function(req, res, next) {
	console.log(req.body);

	var newQuiz = Quiz(req.body);

	// newQuiz.save(function(err) {
	// 	if(err) {
	// 		console.error('Ooops could not create the quiz');
	// 		res.end('error');;	
	// 		return;
	// 	}

	// 	console.log("New quiz created!");
	// 	res.end('ok');
	// });

	Quiz.create(newQuiz, function(err, quiz) {
		if(err) {
			console.error('Ooops could not create the quiz');
			res.end('error');;	
			return;
		}

		console.log("New quiz created!");
		res.end('ok');
	});  	
})
.get(Verify.verifyOrdinaryUser, function(req, res, next) {
	console.log('Retrieving all quizzes');

	Quiz.find({}, function(err, quizzes) {
		if(err) {
			console.error('Ooops could not get quizzes');
			res.end('error');;	
			return;
		}

		res.writeHead(200, {'Content-type': 'application/json'});
		res.end(JSON.stringify(quizzes));
	});
});

router.route('/:quizId')
.put(Verify.verifyAdminUser, function(req, res, next) {
	console.log(req.body);

	Quiz.findByIdAndUpdate(req.params.quizId, {
			$set: req.body
		}, {
			new: true
		}
	).exec(function(err, quiz) {
		if(err) {
			console.error('Ooops could not update quiz');
			res.end('error');;	
			return;
		}

		res.writeHead(200, {'Content-type': 'application/json'});
		res.end(JSON.stringify(quiz));
	});

  	
})


router.route('/comment/:quizId')
.put(Verify.verifyAdminUser, function(req, res, next) {
	console.log(req.body);
	
	Quiz.findById(req.params.quizId, function(err, quiz) {
		if(err) {
			console.error('Ooops could not get quizzes');
			res.end('error');;	
			return;
		}

		quiz.comments.push(req.body);

        quiz.save(function (err, dish) {
            console.log('Updated Comments!');
            console.log(quiz);

           	res.writeHead(200, {'Content-type': 'application/json'});
			res.end(JSON.stringify(quiz));
        });	
	});

  	
})


module.exports = router;
