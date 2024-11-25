
const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema(
    {
        student_id: { type: String, required: true },
        student_name: { type: String, required: true },
        student_email: { type: String, required: true },
    }
);


const instructorSchema = new mongoose.Schema(
    {
        instructor_id: { type: String, required: true },
        instructor_name: { type: String, required: true },
        instructor_pp: { type: String, required: true },
        instructor_bio: { type: String, required: true },
    }
);



const courseSchema = new mongoose.Schema(
    {
        course_id: { type: String, required: true },
        course_title: { type: String, required: true },
        course_description: { type: String, required: true },
        language: { type: String, default: 'English' },
        level: { type: String, default: 'Beginner' },
        duration: { type: String, required: true },

        instructor: { type: instructorSchema, required: true },

        tags: { type: [String], default: [] }

    }
);


const certificateSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        validity: { type: String, default: 'Lifetime', },
        issueDate: { type: Date },

        student: { type: studentSchema, required: true },

        course: { type: courseSchema, required: true },


    },
    { timestamps: true }
);



const Certificate = mongoose.model('certificates', certificateSchema);

module.exports = Certificate;