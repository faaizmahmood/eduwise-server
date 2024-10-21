const express = require('express')
const router = express.Router()
const User = require('../../../models/auth')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

router.post('/signin', async (req, res) => {
    try {

        const { email, password } = req.body;

        console.log(email)

        const userData = await User.findOne({email: email})

        if(!userData){
            res.status(404).json({
                error: "user not found."
            })
            return
        }

        const isMatch = await userData.comparePassword(password);

        if (isMatch) {

            const userObj = userData.toObject()

            const { password, ...userWithoutPassword } = userObj;

            console.log(userWithoutPassword)

            res.status(200).json({
                ...userWithoutPassword
            });
        } else {
            res.status(401).json({
                error: "Password is incorrect."
            });
        }


    } catch (error) {
        res.status(500).json({
            error: "Internal server error"
        })
    }

})


module.exports = router