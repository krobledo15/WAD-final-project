const router = require('express').Router()
const User = require('../models/user.js')
const Data = require('../models/data.js')
const passport = require('passport')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './my-uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
const upload = multer({
    storage: storage
})
const Transform = require('stream-transform')
const Converter = require('csvtojson').Converter
const csv = require('csvtojson')
const generate = require('csv-generate');
const parse = require('csv-parse')
const stringify = require('csv-stringify')
const output = []
const data = []
const should = require('should')



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

//CSV to JSON
//generating csv strings & JS objects
let generator = generate()
generator.on('readable', function() {
    while (d = generator.read()) {
        data.push(d)
    }
})
generator.on('error', function(err) {
    console.log(err);
})
generator.on('end', function() {
    data.should.eql()
})

//Parsing CSV
let parser = parse({ delimiter: ':' })

parser.on('readable', function() {
    while (record = parser.read()) {
        output.push(record)
    }
})
parser.on('error', function(err) {
    console.log(err)
})
parser.on('finish', function() {
    output.should.eql()

})
parser.write()
parser.write()
parser.end()

//Transform CSV
let transformer = Transform(function(data) {
    data.push(data.shift())
    return data
});
transformer.on('readable', function() {
    while (row = transformer.read()) {
        output.push(row)
    }
})
transformer.on('error', function(err) {
    console.log(err.message)
})
transformer.on('finish', function() {
    output.should.eql([])
})
transformer.write()
transformer.write()
transformer.end()

//Stringyfy CSV
let stringData = ''
stringifier = stringify({ delimiter: ':' })
stringifier.on('readable', function() {
    while (row = stringifier.read()) {
        stringData += row
    }
})
stringifier.on('error', function(err) {
    console.log(err.message)
})
stringifier.on('finish', function() {
    stringData.should.eql()
})
stringifier.write()
stringifier.write()
stringifier.end()





module.exports = router

// let converter = csv()
// csv()
//     converter.fromStream(csvReadStream)
//     converter.on('csv', (csvRow, rowIndex) => {
//         // csvRow is an array
//         //rowIndex is the row number of csv line
//     })
//     converter.on('data', (data) => {
//         //data is a buffer getObject
//         const jsonStr = data.toString('utf8')
//     })
//     converter.on('error', (err) => {
//         console.log(err)
//     })
//     converter.on('done', (error) => {
//         console.log('Parsing complete!')
//     })




//function -uploads CSV files to AWS S3 bucket
// const AWS = require('aws-sdk')
//     AWS.config.update({
//         accessKeyId: 'AKIAIZUPD5IITORJVAHQ',
//         secretAccessKey: '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',
//         region: 'us-east-1'
//     })

//     let s3 = new AWS.S3({ apiVersion: '2006-03-01' })
//     let myBucket = 'wad-finalproject-app-uploads'
//     let fileName = 'req.file'

//     s3.createBucket({
//         Bucket: myBucket
//     }, function(err, data) {
//         if (err) {
//             console.log(err)
//         } else {
//             params = {
//                 Bucket: myBucket,
//                 Key: fileName,

//             }
//         }
//         s3.putObject(params, function(err, data) {
//             if (err) {
//                 console.log(err)
//             } else {
//                 console.log("Successfully uploaded data to myBucket")
//             }
//         })

//         s3.getObject(params, function(err, data) {
//             if (err) {
//                 console.log(err)
//             }
//             res.json({
//                 signed_request: data,
//                 url: 'http://' + myBucket + '.s3.amazonaws.com/' + fileName
//             })
//         })
//     })
// })