const express = require('express')
const router = express.Router()
const User = require('../../models/auth')
const Course = require('../../models/courses')
const mongoose = require('mongoose');

router.post('/update-user', async (req, res) => {

    const { user_id, action, data } = req.body;

    console.log(user_id, action, data)

    if (!user_id || !action || !data) {
        return res.status(400).send({ error: "Missing required fields." }); // 400 for missing fields
    }

    const user = await User.findById(user_id)

    switch (action) {
        case "enroll_course":
            try {
                // Enroll Course

                // Check if the user is already enrolled in the course
                if (user.current_courses.some((ele) => ele.course_id == data.course_id)) {
                    return res.status(409).send({ error: "Already Enrolled" }); // 409 Conflict for already enrolled
                }

                // Validate the course_id format
                if (!mongoose.Types.ObjectId.isValid(data.course_id)) {
                    return res.status(400).send({ error: "Invalid course_id format" }); // 400 for invalid course_id format
                }

                let courseObjectId = new mongoose.Types.ObjectId(data.course_id);

                const course = await Course.findById(courseObjectId)

                if (!course) {
                    return res.status(404).send({ error: "Course Not Exists" }); // 404 for course not found
                }

                // Enroll the user in the course
                user.current_courses.push({
                    course_id: data.course_id,
                    progress_percentage: 0,
                    enrollment_date: new Date().toISOString(),
                    title: data.title
                });

                const updatedUser = await user.save(); // Save the updated user object

                return res.status(200).send({
                    message: "User information updated successfully.",
                    updatedUser: updatedUser
                });

            } catch (error) {
                console.log("erroe", error)
                return res.status(500).json({ error: 'An error occurred while Updating Course!' });
            }

        case "save_course":

            try {

                if (user.wishlist.some((ele) => ele.course_id == data.course_id)) {
                    return res.status(409).send({ error: "Already Saved" });
                }

                user.wishlist.push({
                    course_id: data.course_id,
                    course_thumbmail: data.course_thumbmail,
                    course_title: data.course_title,
                    avg_rating: data.avg_rating,
                    instuctor: data.instuctor,
                })


                const updatedUserForSavedCourses = await user.save(); // Save the updated user object

                return res.status(200).send({
                    message: "User information updated successfully.",
                    updatedUser: updatedUserForSavedCourses
                });

            } catch (error) {
                console.log("erroe", error)
                return res.status(500).json({ error: 'An error occurred while Saving Course!' });
            }

        case "unsave_course":

            try {

                if (user.wishlist.some((ele) => ele.course_id == data.course_id)) {

                    user.wishlist = user.wishlist.filter((course) => course.course_id!== data.course_id)

                    const updatedUserForUnSavedCourses = await user.save();

                    return res.status(200).send({
                        message: "User information updated successfully.",
                        updatedUser: updatedUserForUnSavedCourses
                    });
                }

                return res.status(409).send({ error: "Already Un Saved" });


            } catch (error) {
                console.log("erroe", error)
                return res.status(500).json({ error: 'An error occurred while Saving Course!' });
            }


        default:
            return res.status(400).send({ error: "Invalid action specified." }); // 400 for invalid action
    }
});

module.exports = router;
