var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var postSQL = require('../db/postsql');


var pool = mysql.createPool(dbConfig.mysql);

router.get('/', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        connection.query(postSQL.getAllPostsOrderByTime, function (err, result) {
            if (result) {
                res.json({post:result,code:200,msg:"all post"})
            }else{
                res.json({code:400,msg:"not found"})
            }
            connection.release();
        });
    });
});
router.get('/by/:poster', function (req, res, next) {
    console.log(req)
    var poster = req.params.poster
    pool.getConnection(function (err, connection) {
        connection.query(postSQL.allPostsByPoster,[poster], function (err, result) {
            if (result) {
                res.json({post:result,code:200,msg:"all posts"})
            }else{
                res.json({code:400,msg:"not found"})
            }
            connection.release();
        });
    });
});

router.post('/newpost', function (req, res, next) {
    var poster = req.body.poster;
    var ptitle = req.body.ptitle;
    var pcontent = req.body.pcontent;
    var pzone = req.body.pzone;
    var validateMsg = []
    if(!poster) {
        // 做验证
    }
    pool.getConnection(function (err, connection) {
        connection.query(postSQL.insertByPoster,[poster,ptitle,pcontent,pzone], function (err, result) {
            if (result) {
                res.json({code:200,msg:"post success"})
            }else{
                res.json({code:400,msg:"not found"})
            }
            connection.release();
        });
    });
});
router.get('/:pid', function (req, res, next) {
    var pid = req.params.pid;
    pool.getConnection(function (err, connection) {
        connection.query(postSQL.getPostByPid,[pid], function (err, result) {
            if (result) {
                res.json({post:result,code:200,msg:"a post"})
            }else{
                res.json({code:400,msg:"not found"})
            }
            connection.release();
        });
    });
});



module.exports = router;