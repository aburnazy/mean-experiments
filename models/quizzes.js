var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    // author:  {
    //     type: String,
    //     required: true
    // }
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

var quizSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	}, 

	description: {
		type: String,
		required: true
	}, 

	comments: [commentSchema]
}, {timestamps: true});

var Quizzes = mongoose.model('Quiz', quizSchema);

module.exports = Quizzes;