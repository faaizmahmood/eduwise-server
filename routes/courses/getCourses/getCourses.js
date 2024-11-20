const express = require('express')
const router = express.Router()
const Course = require('../../../models/courses')

router.get('/getcourses', async (req, res) => {

   try {
    
    const courses = await Course.find({}) 

    if (!courses) {
        res.status(404).json({
            error: "courses not found"
        })

        return
    }

    if (courses) {
        res.status(200).json({
            courses
        })
        return
    }

   } catch (error) {
    res.status(500).json({
        error: "Internal server error"
    })

    console.log(error)
   }



})


module.exports = router