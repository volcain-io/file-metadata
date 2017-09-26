'use strict'

const express = require('express')
const multer = require('multer')
const path = require('path')

const app = express()
const port = process.env.PORT || 8080
const maxFileSize = 2 * 1024 * 1000 // 2 MB
const mimeTypes = [ 'text/css', 'text/html', 'text/plain', 'image/png', 'image/jpeg', 'image/gif', 'image/svg+xml' ]

const storage = multer.diskStorage( {
        destination: function(request, file, callback) {
            callback(null, '/tmp')
        }
    } )
const limits = { fileSize: maxFileSize }
const fileFilter = function(request, file, cb) {
    let isAllowed = mimeTypes.filter(function(value) {
        if ( value === file.mimetype )
            return true
    })

    if ( isAllowed.length === 0 )
        cb(new Error('Wrong mime type: ' + file.mimetype))
    else
        cb(null, true)
}

const upload = multer( 
    {
        storage: storage,
        limits: limits,
        fileFilter: fileFilter
} ).single('fileToUpload')


app.get('/', function(req, res) {
    res.sendFile( path.join(__dirname + '/views/index.html') )
})

app.post('/fup', function(request, response) {
    upload(request, response, function (err) {
        if (err) {
            response.json( { 'message': err.message } )
        } else {
            response.json( { 'size': request.file.size } )
        }
    })
})

app.listen(port)
