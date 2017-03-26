const router = require('express').Router()
const User = require('../models/user.js')
const Data = require('../models/data.js')
const passport = require('passport')
const multer = require('multer')
const path = require('path')
const Baby = require('babyparse')
const fs = require('fs')
const storage = multer.diskStorage({
    destination: path.resolve(__dirname, '../tmp/uploads'),
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.csv`)
    }
})

const upload = multer({
    storage: storage
})


function protect(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/landing')
}

//Landing Page
router.get('/', protect, function(req, res) {
    return res.redirect('/dashboard')

})

//Register && Login
router.get('/landing', function(req, res) {
    console.log('here')
    return res.render('landing')
})

router.post('/register', function(req, res) {
    console.log(req.body)
    let user = new User(req.body)
    user.save(function(err) {
        if (err) {
            console.log(err)
            return res.render('landing', {
                error: err
            })
        }
        return res.redirect('/dashboard')
    })
})

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/landing',
    })
)

//Dashboard View
router.get('/dashboard', protect, function(req, res) {
    res.send('Worked')
})

//Log Out Button
router.get('/logout', function(req, res) {
    req.logout()
    return res.redirect('/landing')
})

//Upload Redirect Button On Dashboard
router.get('/upload', protect, function(req, res) {
    return res.render('upload')
})

//Selecting A Pre-Existing File On Dashboard 
router.get('/file/:id', protect, function(req, res) {
    let id = req.params.id
    return res.render('/file/:id')
})

//Upload View
router.get('/upload', protect, function(req, res) {
    return res.render('upload')
})

//Upload functionality
//req.file -> is going to represent the uploaded File buffer
router.post('/upload', upload.single('data'), function(req, res) {
    console.log(req.file)
})

let parsedData = Baby.parseFiles(req.file.path, {
    header: true
})
console.log(parsedData)
res.send(200)


module.exports = router