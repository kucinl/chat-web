var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

var config = require('./config');

var routes = require('./routes/index');
var users = require('./routes/users');

var chat = require('./routes/chat');

var app = express();

//设置跨域访问
/*app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});  */

//创建服务器
var server = require('http').createServer(app);
app.set('server', server);

//创建socket
var io = require('socket.io').listen(server);
//io.set("origins", "*");
//配置socket函数
io.on('connection', chat.talk);
//var chat = io.of('/chat').on('connection', chat.talk);
// 设置模板引擎及路径
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
//注册ejs模板为html页。简单的讲，就是原来以.ejs为后缀的模板页，现在的后缀名可以是.html了
app.engine('.html', require('ejs').__express);
//设置视图模板的默认后缀名为.html,避免了每次res.Render("xx.html")的尴尬
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// 定义icon图标
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//定义日志和输出级别
app.use(logger('dev'));
//定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
//定义cookie解析器
app.use(cookieParser());
app.use(session({
  secret: "test"
  , resave: false
  , saveUninitialized: true
}));
//定义静态文件路径
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'bower_components')));
app.use('/static', express.static(path.join(__dirname, 'upload')));
//We are going to protect app with JWT
//app.use(expressJwt({secret: config.secret}));
//挂载路径的中间件
app.use('/', routes);
app.use('/user', users);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message
      , error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message
    , error: {}
  });
});


module.exports = app;
