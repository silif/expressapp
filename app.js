var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var session = require('express-session')

var redisStore = require('connect-redis')(session);
var helmet = require('helmet');
var redis   = require("redis");
var client  = redis.createClient();


// router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRouter2 = require('./routes/users2');
var postRouter =require('./routes/post')
//

// cores header
// app.use(cors())
app.use(helmet());
app.use(cookieParser())


app.all('*',function(req,res,next){
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
	next()
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false ,maxAge: 1 * 60 * 60 * 1000,path: '/'},
	store: new redisStore({ host: 'localhost', port: 6379, client: client}),
}))

// 坑爹，只能先实例一个session，才能在router里修改
app.use(function (req, res, next) {
	if (!req.session.user) {
	  req.session.user = {uname:""}
	}
	next()
})
  
// app.post('/users2/userlogin', function (req, res, next) {
// 	req.session.views['time'] = req.session.views['time'] +1
// 	res.send('you viewed this page ' + req.session.views['time'] + ' times')
	
// })


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/users2', userRouter2);
app.use('/post', postRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
