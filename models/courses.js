const mongoose = require('mongoose');

// Define the Instructor schema
const instructorSchema = new mongoose.Schema({
  id: { type: String, ref: 'Instructor' }, // Reference to the instructor collection
  name: { type: String, required: true },
  profile_image: { type: String },
  bio: { type: String }
});

// Define the Content Schema (for modules and lessons)
const contentSchema = new mongoose.Schema({
  module_number: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  lessons: [
    {
      lesson_number: { type: Number, required: true },
      title: { type: String, required: true },
      duration: { type: String, required: true },
      video_url: { type: String },
      resources: [{ type: String }],
      quiz_id: { type: String, ref: 'Quiz' } // Reference to a quiz document
    }
  ]
});

// Define the Ratings Schema
const reviewSchema = new mongoose.Schema({
  student_id: { type: String, ref: 'Student' },
  rating: { type: Number, required: true },
  comment: { type: String }
});

const ratingsSchema = new mongoose.Schema({
  average_rating: { type: Number, required: true },
  total_reviews: { type: Number, required: true },
  reviews: [reviewSchema]
});

// Define the Price Schema
const priceSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true }
});

// Define the Enrollment Schema
const enrollmentSchema = new mongoose.Schema({
  max_students: { type: Number, required: true },
  current_enrolled: { type: Number, required: true },
  enrolled_students: [{ type: String, ref: 'Student' }]
});

// Define the Course Schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  instructor: { type: instructorSchema, required: true },
  categories: [{ type: String }],
  tags: [{ type: String }],
  language: { type: String, required: true },
  level: { type: String, required: true },
  duration: { type: String },
  price: { type: priceSchema },
  content: [contentSchema],
  enrollment: enrollmentSchema,
  ratings: ratingsSchema,
}, 
{ timestamps: true }
);

// Create and export the model
const Course = mongoose.model('courses', courseSchema);

module.exports = Course;
