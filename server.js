/**
 * DEPENDENCIES
 */
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const Swag = require('swag')
const helpers = require('handlebars-helpers')()
const Promise = require('bluebird')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path')
const controllers = require('./controllers')
const User = require('./models/user.js')

/**
 * CONFIGURATION OF MIDDLEWARES
 */
Promise.promisifyAll(require('mongoose'))
mongoose.connect('mongodb://localhost:27017/FinalProject')

app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: helpers,
}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')

Swag.registerHelpers(Handlebars)

//Serialization & Deserialization of User ID
passport.serializeUser(function(user, callback) {
    return callback(null, user.id);
})

passport.deserializeUser(function(id, callback) {
    User.findById(id, function(err, user) {
        return callback(err, user)
    })
})



//Login
passport.use(new localStrategy(
    function(username, password, callback) {
        console.log(username)
        console.log(password)
        User.findOne({
            email: username
        }, function(err, user) {
            if (err) {
                return callback(err)
            }
            if (!user) {
                return callback(null, false, {
                    message: 'Incorrect Username'
                })
            }
            if (user.password !== password) {
                return callback(null, false, {
                    message: 'Incorrect Password'
                })
            }
            return callback(null, user)
        })
    }))

/**
 * ROUTER HANDLERS
 */
app.use(controllers)


/**
 * SERVER INITIALIZATION
 */
app.listen(3000, function() {
    console.log('Server listening on port 3000');
});