const mongoose = require('mongoose')
const bycrypt = require('bcrypt')

const authSchema = new mongoose.Schema({
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
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
)

authSchema.pre('save', async function (next) {

    const user = this;

    if (!user.isModified('password')) return next()

    try {

        const salt = await bycrypt.genSalt(10)

        const hashedPassword = await bycrypt.hash(user.password, salt)

        user.password = hashedPassword


    } catch (error) {
        next(error)
    }
})


authSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bycrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

const User = mongoose.model('users', authSchema)

module.exports = User