var express = require('express')
var router = express.Router()

router.get('/api/hello', (req, res) => {
    res.json('hello world')
    console.log('response sent')
})

module.exports = router