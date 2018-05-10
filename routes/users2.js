var express = require('express');
var router = express.Router();
var md5 = require('md5');
// 验证码
var svgCaptcha = require('svg-captcha');
// 文件上传
var multer = require('multer');
// var upload = multer({ dest: 'uploadsmmmmmm/' })

// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/usersql');

// 文件上传设置
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatar/')
    },
    filename: function (req, file, cb) {
        var thisfileName = ""
        console.log(req.session)
        if (req.session.user) {
            // 已登陆
            console.log("file",file)
            // 有新的头像则覆盖原有的
            var imgType = 'png'
            if(file.mimetype.indexOf("png")){
                imgType = "png"
            }else if(file.mimetype.indexOf("jpeg")){
                imgType = "jpg"
            }else if(file.mimetype.indexOf("gif")) {
                imgType = "gif"
            }
            thisfileName = req.session.user.uname+'.'+imgType 
        } else {
            // 未登录
            thisfileName = "notlogin" + file.originalname
        }
        cb(null, thisfileName)
    }
})
var upload = multer({ storage: storage })



// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool(dbConfig.mysql);

// get user by id
router.get('/userGetById', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        console.log(req.query)
        var param = req.query;
        connection.query(userSQL.getUserById, [param.id], function (err, result) {
            if (result) {
                res.json({ user: result, msg: "找到了" })
            } else {
                res.json({ user: "", msg: "没找到" })
            }
            connection.release();

        });
    });
});

// 判断用户是否登陆
router.get('/getUserInfo', function(req, res, next) {
    var user = req.session.user;
    if(!!user) {
        var uname = req.session.user.uname;
        pool.getConnection(function (err, connection) {
            connection.query(userSQL.getUserInfo, [uname], function (err, result) {
                console.log(result)
                res.json({
                    islogin:true, 
                    msg:"已登陆",
                    info:result[0],
                })
                connection.release();
            });
        })
    }else{
        res.json({
            islogin:false,
            msg:'未登录'
        })
    }
})
// login module
// router users2/userlogin
router.post('/userlogin', function (req, res, next) {
    var password = req.body.password;
    var uname = req.body.username;
    pool.getConnection(function (err, connection) {
        connection.query(userSQL.loginsql, [uname, md5(password)], function (err, result) {
            if (result && result.length) {
                if (!req.session.user) {
                    // 首次
                    req.session.user = { uname: uname }
                } else if (req.session.user.uname !== uname) {
                    // 切换账号
                    req.session.user = { uname: uname }
                }
                console.log(result)
                result.password = null
                res.json({ 
                    islogin:true, 
                    msg:"已登陆",
                    info:result[0]
                 })
            } else {
                res.json({ code: 404, msg: "not found" })
            }
            connection.release();
        });
    });
});
// 登出 destory session
router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
        // cannot access session here
    })
    console.log('destroyed?', req.session)
    res.status(200).json({ msg: "logout" })
});
// 验证码
router.post('/codepic', function (req, res, next) {
    console.log(req.session)
    var captcha = svgCaptcha.create();
    res.type('svg');
    res.status(200).send(captcha.data);
})
// 注册
router.post('/register', function (req, res, next) {
    var password = req.body.password;
    var uname = req.body.username;
    pool.getConnection(function (err, connection) {
        connection.query(userSQL.register, [uname, md5(password)], function (err, result) {
            if (result) {
                res.status(200).json({ msg: "success", code: 200 })
            } else {
                res.status(200).json({ code: 400, msg: "fail" })
            }
            connection.release();
        });
    });
});

router.post('/avatarupload', upload.single('avatar'), function (req, res, next) {
    if(!req.session.user){
        res.status(401).json({ code: 401, msg: "fail" })
        return
    }
    console.log(req.file)
    var path = req.file.fieldname + '/' + req.file.filename;
    
    var uname = req.session.user.uname
    console.log(uname)
    pool.getConnection(function (err, connection) {
        connection.query(userSQL.updateAvatar, [path, uname], function (err, result) {
            // console.log(result)
            if (result) {
                res.status(200).json({ msg: path, code: 200 })
            } else {
                res.status(200).json({ code: 400, msg: "fail" })
            }
            connection.release();
        });
    });
})
module.exports = router;