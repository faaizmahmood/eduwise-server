
const mongoose = require('mongoose');

// Define the option schema
const OptionSchema = new mongoose.Schema({
  option_id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  is_correct: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Define the question schema
const QuestionSchema = new mongoose.Schema({
  question_id: {
    type: String,
    required: true,
  },
  question_text: {
    type: String,
    required: true,
  },
  options: {
    type: [OptionSchema],
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 2; // Ensure there are at least 2 options
      },
      message: 'A question must have at least two options.',
    },
  },
});

// Define the quiz schema
const QuizSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  course_id: {
    type: String,
    required: true,
  },
  quiz_title: {
    type: String,
    required: true,
  },
  questions: {
    type: [QuestionSchema],
    required: true,
  },
});

// Create the Quiz model
const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;
