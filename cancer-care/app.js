
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  ,doctors=require('./routes/doctors')
  , http = require('http')
  , path = require('path')
  , favicon = require('serve-favicon')
  ,	recommendation=require('./routes/recommendation')
  ,registration=require('./routes/registration')
  ,profile = require('./routes/profile')
  ,passport = require('passport')
  ,session = require('express-session')
  ,MongoStore=require('connect-mongo')(session)
  ,LocalStrategy = require('passport-local').Strategy;

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public', 'favicon_cancer.ico')));


app.use(session({  
	  store:new MongoStore({url:'mongodb://cmpe295:cmpe295@ds023500.mlab.com:23500/session'}),
	  secret: "best project ever",
	  resave: false,
	  saveUninitialized: false
	}));
app.use(passport.initialize());  
app.use(passport.session());

app.use(app.router);

//passport config
passport.serializeUser(function (user, done) {
    console.log("serializing " + user.email);
    done(null, user.email);
});

passport.deserializeUser(function (username, done) {
	
    console.log("deserializing " + username);
    registration.findUserById(username, done);

    //done(null, user);
});

passport.use( new LocalStrategy({ passReqToCallback : true,usernameField: 'email'},
	    function (req,email, password, done) {
			console.log(email+" "+password);
	        registration.findUser(email,password, function (err, user) {
	            if (err) {
	                return done(err);
	            }
	            if (!user) {
	                return done(null, false);
	            }
	            return done(null, user);
	        });
	    }
	));

//use later
passport.authenticationMiddleware = function() {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next(req, res);
        }
        res.redirect('/faliureLogin');
    };
};

function loggedIn(req, res, next) {
    if (!req.user) {
        res.status(404).send("Unauthorized");


    } else {
        if (req.user.email === req.params.id) {
            next();
        }
        else {
            res.status(401).send("Unauthorized");
        }
    }

}

//development only
if ('development' == app.get('env')) {
app.use(express.errorHandler());
}
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/radoninfo',recommendation.getRadonInfo);
app.get('/getLifestyleArticles', recommendation.getLifestyleArticles);
app.get('/radoninfoGeneral',recommendation.getRadonInfoGeneral);
app.get('/successLogin',function(req,res){
	res.status(200).send("success");
});
app.get('/faliureLogin',function(req,res){
	res.status(401).send("Unauthorized");
});
app.get('/patientProfile',function(req,res){
	 res.render('patientProfile', { title: 'Circle of Hope' });
});
app.get('/doctorProfile',function(req,res){
	 res.render('doctorProfile', { title: 'Circle of Hope' });
});
app.post('/register',registration.patientRegister);
//app.post('/login',registration.login);
app.post('/login', passport.authenticate('local', {
    successRedirect: '/successLogin',
    failureRedirect: '/faliureLogin'
}));

app.post('/addFACTL',profile.addFACTL);
app.post('/doctorRegister',registration.doctorRegister);
app.post('/getDoctors',doctors.getDoctors);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
