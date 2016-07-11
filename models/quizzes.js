var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quizSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	}, 

	description: {
		type: String,
		required: true
	}
}, {timestamps: true});

var Quizzes = mongoose.model('Quiz', quizSchema);

module.exports = Quizzes;