
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  ,doctors=require('./routes/doctors')
  , http = require('http')
  , path = require('path')
  , favicon = require('serve-favicon')
  ,	recommendation=require('./routes/recommendation')
  ,registration=require('./routes/registration')
  ,profile=require('./routes/profile');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public', 'favicon_cancer.ico')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/radoninfo',recommendation.getRadonInfo);
app.get('/radoninfoGeneral',recommendation.getRadonInfoGeneral);
app.post('/register',registration.register);
app.post('/login',registration.login);
app.post('/addFACTL',profile.addFACTL);

app.post('/getDoctors',doctors.getDoctors);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
