const express = require('express')
const app = express()
const db = require('./db/db')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')

app.use(bodyParser.json())
app.use(passport.initialize())

app.use(cors({
    origin: ['http://localhost:5173', 'https://www.eduwiseapp.tech', 'http://localhost:5174', 'https://certificate.eduwiseapp.tech', 'https://app.eduwiseapp.tech'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));


// routes
const authSigninRouter = require('./routes/auth/siginin/authSigin')
const authSignupRourter = require('./routes/auth/signup/authSignup')
const authUsernameRouter = require('./routes/auth/username/username')
const authNewReqRouter = require('./routes/auth/newOtp/newOtp')
const getCoursesRouter = require('./routes/courses/getCourses/getCourses')
const getSingleCoursesRouter = require('./routes/courses/singleCourse/singleCourse')
const ReviewRouter = require('./routes/courses/reviewCourse/reviewCourse')
const quizRouter = require('./routes/quiz/quiz')
const addQuizRouter = require('./routes/quiz/addQuiz/addQuiz')
const userUpdateRouter = require('./routes/user/user')
const allCertificateRouter = require('./routes/certificate/certificate')
const singleCertificateRouter = require('./routes/certificate/singleCertificate')
const settingRouter = require('./routes/setting/setting')
const requestsRouter = require('./routes/InstructorRequests/requests')
const getRequestsRouter = require('./routes/InstructorRequests/getRequests')
const getSingleRequestsRouter = require('./routes/InstructorRequests/getSingleRequest')
const approveRejectRequestsRouter = require('./routes/InstructorRequests/approve-reject')
const getSingleInstructorRouter = require('./routes/Instructor/getSingleInstructor')
const uploadCourseRouter = require('./routes/courses/uploadCourses/uploadCourse')
const draftsRouter = require('./routes/courses/drafts/drafts')
const instructorDashboardRouter = require('./routes/InstructorDashboard/InstructorDashboard')
const adminDashboardRouter = require('./routes/adminDashboard/adminDashboard')
const adminUsersRouter = require('./routes/adminUsers/adminUsers')
const adminInstructorsRouter = require('./routes/adminInstructor/adminInstructor')
const getInstructorProfileRouter = require('./routes/getSingleInstrcutor/getSingleInstrcutor')
const suspendeAccountRouter = require('./routes/deleteuser/deleteUser')
const getInstructorCoursesRouter = require('./routes/getInstructorCourses/getInstructorCourses')


// Middlware

const logRequest = (req, res, next) => {
    console.log(`${new Date().toLocaleString()} Request made to: ${req.originalUrl}`);
    next()
}

app.use(logRequest)

app.get('/', (req, res) => {
    res.send("Express JS is running...")
})


// end points
app.use('/api/auth', authSigninRouter)
app.use('/api/auth', authSignupRourter)
app.use('/api/auth', authUsernameRouter)
app.use('/api/auth', authNewReqRouter)
app.use('/api/courses', getCoursesRouter)
app.use('/api/courses', getSingleCoursesRouter)
app.use('/api/courses', ReviewRouter)
app.use('/api/quiz', quizRouter)
app.use('/api/quiz', addQuizRouter)
app.use('/api/user', userUpdateRouter)
app.use('/api/certificate', allCertificateRouter)
app.use('/api/certificate', singleCertificateRouter)
app.use('/api/setting', settingRouter)
app.use('/api/instructor-requests', requestsRouter)
app.use('/api/instructor-requests', getRequestsRouter)
app.use('/api/instructor-requests', getSingleRequestsRouter)
app.use('/api/instructor-requests', approveRejectRequestsRouter)
app.use('/api/instructor', getSingleInstructorRouter)
app.use('/api/course', uploadCourseRouter)
app.use('/api/course', draftsRouter)
app.use('/api/instructor', instructorDashboardRouter)
app.use('/api/admin', adminDashboardRouter)
app.use('/api/admin', adminUsersRouter)
app.use('/api/admin', adminInstructorsRouter)
app.use('/api/instructor', getInstructorProfileRouter)
app.use('/api/delete', suspendeAccountRouter)
app.use('/api/instructor', getInstructorCoursesRouter)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("listening on port 5000")
})


// app.listen(5000, ()=>{
//     console.log("listening on port 5000")
// })
