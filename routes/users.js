var express = require('express');
var router = express.Router();

var users = [
  {
    name:'yangdong',
    age:26,
    id:1
  },{
    name:'jingjing',
    age:25,
    id:2
  },{
    name:'jian yang',
    age:25,
    id:3
  }
]


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({users:users});
});

module.exports = router;
