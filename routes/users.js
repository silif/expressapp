var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '1234',
	database: 'expressapp'
});
connection.connect(function (err) {
	if (!err) {
		console.log("Database is connected ... \n\n");
	} else {
		console.log("Error connecting database ... \n\n");
	}
});

/* GET users listing. */
router.get('/', function (req, res, next) {
	var allUsers = [];
	connection.query('SELECT * FROM user;', function (err, rows, fields) {
		if (err) {
			throw err;
		} else {
			allUsers = rows;
			res.json({ users: allUsers });
		}

	})

});

// query by uid
router.get('/:id', function (req, res, next) {
	var user = [];
	var uid = req.params.id;
	try {
		connection.query('SELECT * FROM user where id = ' + "'" + uid + "'", function (err, rows, fields) {
			if (err) {
				throw err;
			} else {
				user = rows;
				res.json({ "user": user });
			}
		})
	} catch (error) {
		throw error;
	}

});
// modify by uid
router.put('/:id', function (req, res, next) {
	console.log(req.body)
	var uid = req.params.id;
	var body = req.body;
	var bodyKeys = Object.keys(body);

	var queryItems = ""
	for (var i = 0; i < bodyKeys.length; i++) {
		console.log(bodyKeys[i])
		var item = bodyKeys[i] + "=" + "'" + body[bodyKeys[i]] + "'" + " ,"
		queryItems += item
	}

	queryItems = queryItems.substring(0, queryItems.length - 1)
	var sqlQuery = "UPDATE user SET " + queryItems + " WHERE id = " + "'" + uid + "'" + ";";
	console.log("sqlQuery", sqlQuery)

	try {
		connection.query(sqlQuery, function (err, rows, fields) {
			if (err) {
				throw err;
			} else {
				res.json({ "code": 200 });
			}
		})
	} catch (error) {
		throw error;
	}
});

module.exports = router;

// 上面的这些写法都很粗糙，需要有更好的办法来处理错误、封装、提升性能等问题。
// 噢，user2.js 里的代码就好多了