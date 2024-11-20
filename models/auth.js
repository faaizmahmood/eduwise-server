const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const authSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    privacyPolicy: {
      type: Boolean,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: 'student',
    },
    interests: [{ type: String }], // New field for user interests
    current_courses: [
      {
        course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        progress_percentage: { type: Number, default: 0 },
        last_accessed_lesson: {
          module_number: { type: Number },
          lesson_number: { type: Number },
        },
        enrollment_date: { type: Date },
      },
    ],
    completed_courses: [
      {
        course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        completion_date: { type: Date },
        certificate_url: { type: String },
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    enrollment_status: { type: String, default: 'active' },
    profile_image: { type: String },
    country: { type: String },
    phone_number: { type: String },
    notifications: {
      email_notifications: { type: Boolean, default: true },
      sms_notifications: { type: Boolean, default: false },
    },
    settings: {
      language_preference: { type: String, default: 'English' },
      dark_mode: { type: Boolean, default: false },
    },
  },
  { timestamps: true } // Automatically handles createdAt and updatedAt
);

// Hash password before saving
authSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  } catch (error) {
    next(error);
  }
});

// Compare passwords
authSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('User', authSchema);

module.exports = User;
