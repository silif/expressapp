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
var commentsRouter =require('./routes/comments')
//

// cores header
// app.use(cors())
app.use(helmet());
app.use(cookieParser())


app.all('*',function(req,res,next){
	// 允许来自其他domain的cookie
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
	secret: 'myforum token',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false ,maxAge: 1 * 60 * 60 * 1000,path: '/'},
	store: new redisStore({ host: 'localhost', port: 6379, client: client}),
}))


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/users2', userRouter2);
app.use('/post', postRouter);
app.use('/comments', commentsRouter);



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
