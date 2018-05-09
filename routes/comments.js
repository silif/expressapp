var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var comments = require('../db/commentssql');


var pool = mysql.createPool(dbConfig.mysql);

router.get('/:pid', function (req, res, next) {
    var pid = req.params.pid
    pool.getConnection(function (err, connection) {
        connection.query(comments.getCommentsByPid, [pid],function (err, result) {
            if (result) {
                res.json({post:result,code:200,msg:"all post"})
            }else{
                res.json({code:400,msg:"not found"})
            }
            connection.release();
        });
    });
});
router.post('/reply', function (req, res, next) {
    if(!req.session.user) {
        res.status(401).json({code:401,msg:"not found"})
        return
    }
    var commentby = req.session.user.uname;
    var commentto = req.body.commentto;
    var commentcontent = req.body.commentcontent;
    var pid = req.body.pid;
    pool.getConnection(function (err, connection) {
        connection.query(comments.insertComment, [commentby,commentto,commentcontent,pid],function (err, result) {
            if (result) {
                pool.getConnection(function (err, connectionIn) {
                    connectionIn.query(comments.getCommentsByPid, [pid],function (err, result) {
                        if (result) {
                            res.json({post:result,code:200,msg:"all post"})
                        }else{
                            res.json({code:400,msg:"not found"})
                        }
                        connectionIn.release();
                    });
                });
            }else{
                res.json({code:400,msg:"not found"})
            }
            connection.release();
        });
    });
});
module.exports = router;
