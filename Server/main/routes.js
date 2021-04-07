var express = require('express')
var router = express.Router()
var pool = require('./db')

router.get('/api/hello', (req, res) => {
    res.json('hello world')
    console.log('response sent')
})

// POSTS ROUTES SECTION

router.get('/api/get/allposts', (req, res, next ) => {
    pool.query(`SELECT * FROM posts 
                ORDER BY date_created DESC`, 
              (q_err, q_res) => {
                    res.json(q_res.rows)
    })
  })

  router.get('/api/get/post', (req, res, next) => {
      const post_id = req.query.post_id

      pool.query(`SELECT * FROM posts
                WHERE pid=$1`,
                [post_id], (q_err, q_res) => {
                    res.json(q_res.rows)
                })
  })


module.exports = router
