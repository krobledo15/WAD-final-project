const http = require('http');
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const router = express.Router()
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const AWS = require('aws-sdk')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// mongoose.connect('mongodb://localhost/FinalProject')

app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({ secret: 'keyboard cat' }))
app.use(passport.initialize())
app.use(passport.session())
    //app.use(router)
    //app.use(flash)

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')


//Serialization of User ID
passport.serializeUser(function(user, callback) {
    return callback(null, user.id);
})

passport.deserializeUser(function(id, callback) {
    User.findById(id, function(err, user) {
        return callback(err, user)
    })
})

//Log In - LOGIN ABILITITES SHOULD BE ON MAIN PAGE; CHANGE TO '/MAIN'??
passport.use(new localStrategy(
    function(username, password, callback) {
        User.findOne({ username: username }, function(err, user) {
            if (err) { return callback(err) }
            if (!user) {
                return callback(null, false, { message: 'Incorrect Username' })
            }
            if (user.password !== password) {
                return callback(null, false, { message: 'Incorrect Password' })
            }
            return callback(null, user)
        })
    }))


app.get('/login', function(req, res) {
    return res.render('login', { login: true, error: req.flash('error') })
})

app.post('/login', bodyParser.urlencoded(),
    passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/login', failureFlash: true })
)

//Register 
app.get('/register', function(req, res) {
    return res.render('login')
})

app.post('/register', bodyParser.urlencoded(), function(req, res) {
    let user = new User(req.body)
    user.save(function(err) {
        if (err) { return res.render('login', { error: err }) }
        return res.redirect('/')
    })
})

//Dashboard View
app.get('/dashboard', function(req, res) {

})

//Log Out Button -DOES IT REDIRECT TO LOGIN OR MAIN???
app.get('/logout', function(req, res) {
    req.logout()
    return res.redirect('/')
})

//Upload Redirect Button On Dashboard
app.get('/upload', function(req, res) {
    return res.render('upload', { successRedirect: '/dashboard', failureRedirect: '/upload' })
})

//Selecting A Pre-Existing File On Dashboard - USE res.sendFile ????
app.get('/file/:id', function(req, res) {
    let id = req.params.id
    return res.render('/file/:id')
})

//Upload View
app.get('/upload', function(req, res) {

})

//Upload function - uploads CSV files to AWS S3 bucket
app.post('/upload', upload.single('data'), function(req, res) {
    console.log(req.file)
        //AWS secret access keys
    aws_access_key_id = AKIAIXPI5U6MTQ6EWYFQ
    aws_secret_access_key = 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

    let s3 = new AWS.S3()
    let myBucket = 'wad-finalproject-app-uploads'
    let myKey = 'AKIAIXPI5U6MTQ6EWYFQ'

    s3.createBucket({ Bucket: myBucket }, function(err, data) {
        if (err) {
            console.log(err)

        } else {

            params = { Bucket: myBucket, Key: myKey, Body: 'Hello!' };

            s3.putObject(params, function(err, data) {

                if (err) {

                    console.log(err)

                } else {

                    console.log("Successfully uploaded data to myBucket/myKey");

                }

            })

        }

    })
})


app.listen(3000, function() {
    console.log('Server listening on port 3000');
});