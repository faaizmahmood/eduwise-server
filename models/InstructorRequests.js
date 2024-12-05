const mongoose = require('mongoose');

const InstructorSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    InstructorPic: { type: String, required: true },
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    audience: { type: String, required: true },
    contentType: { type: [String], required: true },
    degreeLevel: { type: String, required: true },
    degreeTitle: { type: String, required: true },
    degreeYoP: { type: String, required: true },
    experienceYoP: { type: String, required: true },
    expertise: { type: [String], required: true },
    institutionName: { type: String, required: true },
    internetSpeed: { type: String, required: true },
    resume: { type: String, required: true },
    selectedEquipment: {
        'Desktop/Laptop': { type: Boolean, default: false },
        Webcam: { type: Boolean, default: false },
        Microphone: { type: Boolean, default: false },
        'Drawing Tablet': { type: Boolean, default: false },
        'Lighting Setup': { type: Boolean, default: false },
    },
    specialization: { type: String, required: true },
    teachingExperience: { type: String, required: true },
    teachingMethodology: { type: String, required: true },
    termsAccepted: { type: Boolean, required: true },
    yearsOfExperience: { type: String, required: true },
});


const Instructor = mongoose.model('instructorRequests', InstructorSchema)


module.exports = Instructor;