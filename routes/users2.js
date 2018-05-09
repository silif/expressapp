var express = require('express');
var router = express.Router();
var md5 = require('md5');
// 验证码
var svgCaptcha = require('svg-captcha');
// 文件上传
var multer  = require('multer');
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
        if(req.session.user) {
            // 已登陆
            thisfileName = req.session.user+ file.originalname
        }else{
            // 未登录
            thisfileName = "notlogin"+file.originalname
        }
        cb(null,thisfileName)
    }
})
var upload = multer({storage: storage})



// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool(dbConfig.mysql);
// 响应一个JSON数据
var responseJSON = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '-200', msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};



// 添加用户
router.post('/userAdd', function (req, res, next) {
    // 从连接池获取连接 
    pool.getConnection(function (err, connection) {
        // 获取前台页面传过来的参数  
        var param = req.body;
        // 建立连接 增加一个用户信息 
        connection.query(userSQL.insert, [0, param.uname, param.uage, param.ugender], function (err, result) {
            console.log(result)
            if (result) {
                result = {
                    code: 200,
                    msg: '增加成功'
                };
            }

            // 以json形式，把操作结果返回给前台页面     
            responseJSON(res, result);

            // 释放连接  
            connection.release();

        });
    });
});

// 修改用户
router.post('/userUpdate', function (req, res, next) {
    // 从连接池获取连接 
    pool.getConnection(function (err, connection) {
        // 获取前台页面传过来的参数  
        var param = req.body;
        // 建立连接 修改一个用户信息 
        console.log([param.uname, param.uage, param.ugender, param.uid])
        connection.query(userSQL.update, [param.uname, param.uage, param.ugender, param.uid], function (err, result) {
            console.log(result)
            if (result) {
                result = {
                    code: 200,
                    msg: '修改成功'
                };
            }

            // 以json形式，把操作结果返回给前台页面     
            responseJSON(res, result);

            // 释放连接  
            connection.release();

        });
    });
});


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
                result.password=null
                res.json({ user: result, msg: "found", code: 200 })
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

router.post('/avatarupload',upload.single('avatar'), function(req, res, next){
    console.log(req.body)
    console.log(req.file)
    var path = req.file.fieldname+'/'+req.file.filename;
    pool.getConnection(function (err, connection) {
        connection.query(userSQL.updateAvatar, [path,'yangdong'], function (err, result) {
            console.log(result)
            if (result) {
                res.status(200).json({ msg: "success", code: 200 })
            } else {
                res.status(200).json({ code: 400, msg: "fail" })
            }
            connection.release();
        });
    });
})
module.exports = router;