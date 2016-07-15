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

	Quiz.find({})
		.populate('comments.postedBy')
		.exec( function(err, quizzes) {
				if(err) {
					throw err;
				}

				res.json(quizzes);
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


router.route('/:quizId/comment')
.post(Verify.verifyOrdinaryUser, function(req, res, next) {
	console.log(req.body);
	
	Quiz.findById(req.params.quizId, function(err, quiz) {
		if(err) {
			console.error('Ooops could not get quizzes');
			res.end('error');;	
			return;
		}
		var comment = req.body;
		comment.postedBy = req.decoded._doc._id;

		quiz.comments.push(comment);

        quiz.save(function (err, dish) {
            console.log('Updated Comments!');
            console.log(quiz);

           	res.writeHead(200, {'Content-type': 'application/json'});
			res.end(JSON.stringify(quiz));
        });	
	});

  	
});

router.route('/:quizId/comment/:commentId')
.all(Verify.verifyOrdinaryUser)

.put(function(req, res, next) {
	Quiz.findById(req.params.quizId, function(err, quiz) {
		if(err) throw err;

		if(quiz.comments.id(req.params.commentId).postedBy != req.decoded._doc._id) {
			var err = new Error("You are not allowed to perform this operation!");
			err.status = 403;

			return next(err);
		}

		quiz.comments.id(req.params.commentId).remove();

		req.body.postedBy = req.decoded._doc._id;

		quiz.comments.push( req.body );		

		quiz.save( function(err, quiz) {
			if(err) throw err;
			console.log("Updated Comments!");
			console.log(quiz);

			res.json(quiz);
		} );
	});
})

.delete(function(req, res, next) {
	Quiz.findById(req.params.quizId, function(err, quiz) {

		if(quiz.comments.id(req.params.commentId).postedBy != req.decoded._doc._id) {
			var err = new Error("You are not allowed to perform this operation!");
			err.status = 403;

			return next(err);
		}

		quiz.comments.id(req.params.commentId).remove();

		quiz.save(function(err, resp) {
			if(err) throw err;

			res.json(resp);
		});
	});
})

;



module.exports = router;
