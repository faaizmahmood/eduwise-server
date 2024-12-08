const mongoose = require('mongoose');

// Define the Instructor schema
// Define the Instructor schema
const instructorSchema = new mongoose.Schema({
  id: { type: String, ref: 'Instructor' }, // Reference to the instructor collection
  name: { type: String },
  profile_image: { type: String },
  bio: { type: String }
});

// Define the Content Schema (for modules and lessons)
// const contentSchema = new mongoose.Schema({
//   module_number: { type: Number, required: true },
//   title: { type: String, required: true },
//   description: { type: String },
//   lessons: [
//     {
//       lesson_number: { type: Number, required: true },
//       title: { type: String, required: true },
//       duration: { type: String, required: true },
//       video_url: { type: String },
//       resources: [{ type: String }],
//       quiz_id: { type: String, ref: 'Quiz' } // Reference to a quiz document
//     }
//   ]
// });

// Define the Ratings Schema
const reviewSchema = new mongoose.Schema({
  student_id: { type: String, ref: 'Student' },
  rating: { type: Number },
  comment: { type: String }
});

const ratingsSchema = new mongoose.Schema({
  average_rating: { type: Number, default: 0 },
  total_reviews: { type: Number, default: 0 },
  reviews: [reviewSchema]
});


// Define the Enrollment Schema
const enrollmentSchema = new mongoose.Schema({
  current_enrolled: { type: Number, default: 0 },
  enrolled_students: [{ type: String, ref: 'Student' }]
});

// Define the Course Schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  instructor: { type: instructorSchema, required: true },
  thumbnail: { type: String, required: true }, // New field for thumbnail
  video: { type: String, required: true }, // New field for video
  categories: [{ type: String }],
  tags: [{ type: String }],
  language: { type: String, required: true },
  level: { type: String, required: true },
  duration: { type: String, required: true },
  // content: [contentSchema],
  enrollment: enrollmentSchema,
  ratings: ratingsSchema,
},
  { timestamps: true }
);

// Create and export the model
const Course = mongoose.model('courses', courseSchema);

module.exports = Course;
