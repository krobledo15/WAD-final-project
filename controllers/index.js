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

//Landing Page - ADD protect, BEFORE FUNCTION
router.get('/', function(req, res) {
    return res.redirect('/dashboard')

})

//Register && Login
router.get('/landing', function(req, res) {
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

//Dashboard View- ADD protect, BEFORE FUNCTION
router.get('/dashboard', protect, function(req, res) {
    return res.render('dashboard')
    res.status(200).send('Worked')
})


//Log Out Button
router.get('/logout', function(req, res) {
    req.logout()
    return res.redirect('/landing')
})

//Upload Redirect Button On Dashboard- ADD protect, BEFORE FUNCTION
// router.get('/upload', function(req, res) {
//     return res.redirect('/upload')
// })

//Selecting A Pre-Existing File On Dashboard - ADD protect, BEFORE FUNCTION
router.get('/file/:id', protect, function(req, res) {
    let id = req.params.id
    return res.render('/file/:id')
})

// Reports View
router.get('/reports', protect, function(req, res) {
    return res.render('reports')
})

//Upload View- ADD protect, BEFORE FUNCTION
router.get('/upload', protect, function(req, res) {
    return res.render('upload')
        // return res.sendFile(__dirname + '/upload')
})

//Upload functionality && Parse Data
//req.file -> is going to represent the uploaded File buffer
router.post('/upload', protect, upload.single('data'), function(req, res) {
    console.log(req.user)
    let parsedData = Baby.parseFiles(req.file.path, {
        header: true
    })

    // When you have the protect middleware, you will have access to the req.user property, ADD PROTECT AFTER YOU FINISH TESTING WITH GRAPHS
    let data = new Data({
        filename: req.file.filename,
        filetype: req.body.filetype,
        reportname: req.body.filename,
        userID: req.user.id, //This is a placeholder, replace with ACTUAL user id which is passed by passport
        contents: parsedData.data
    })

    data.save(function(err) {
        if (err) {
            return res.json({ status: 400, error: err })
        }
        return res.redirect('/reports')
    })
})

// Reports View
router.get('/reports', protect, function(req, res) {
    req('data')
    return res.render('/reports')
})





module.exports = router