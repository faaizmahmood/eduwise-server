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

        //enroll_course

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
                    title: data.title,
                    thumbnail: data.thumbnail
                });

                const updatedUser = await user.save(); // Save the updated user object

                const updatedCourse = await Course.findOneAndUpdate(
                    { _id: courseObjectId },
                    {
                        $inc: { 'enrollment.current_enrolled': 1 }, // Increment current_enrolled by 1
                        $addToSet: { 'enrollment.enrolled_students': user._id } // Add user ID if not already present
                    },
                    { new: true } // Return the updated course document
                );

                if (!updatedCourse) {
                    return res.status(500).send({ error: "Failed to update course enrollment" });
                }

                return res.status(200).send({
                    message: "User enrolled successfully.",
                    updatedUser: updatedUser,
                    updatedCourse: updatedCourse
                });

            } catch (error) {
                console.log("erroe", error)
                return res.status(500).json({ error: 'An error occurred while Updating Course!' });
            }

        //save_course

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


        //unsave_course

        case "unsave_course":

            try {

                if (user.wishlist.some((ele) => ele.course_id == data.course_id)) {

                    user.wishlist = user.wishlist.filter((course) => course.course_id !== data.course_id)

                    const updatedUserForSavedCourses = await user.save();

                    return res.status(200).send({
                        message: "User information updated successfully.",
                        updatedUser: updatedUserForSavedCourses
                    });
                }

                return res.status(409).send({ error: "Already Un Saved" });


            } catch (error) {
                console.log("erroe", error)
                return res.status(500).json({ error: 'An error occurred while Saving Course!' });
            }


        // update_preference

        case "update_preference":

            try {


                if (data?.preference.length > 5) {
                    return res.status(400).send({
                        message: "Should Be Less Than 5",
                    });
                }

                user.interests = data?.preference

                const updatedUserForSavedCourses = await user.save();

                return res.status(200).send({
                    message: "User information updated successfully.",
                    updatedUser: updatedUserForSavedCourses
                });

            } catch (error) {
                console.log("erroe", error)
                return res.status(500).json({ error: 'An error occurred while Updating Details!' });
            }


        default:
            return res.status(400).send({ error: "Invalid action specified." }); // 400 for invalid action
    }
});

module.exports = router;
