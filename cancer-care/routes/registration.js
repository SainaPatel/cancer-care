var mongo = require("./mongo");
var mongoURL = "mongodb://cmpe295:cmpe295@ds161630.mlab.com:61630/radon";
var json_responses={};
exports.patientRegister = function (req, res){
	console.log (req.body);
	mongo.connect(mongoURL,function() {
	mongo.collection('user').insertOne(req.body,function(err, user) { 
		if (user) {
			json_responses.status_code=200;
			console.log('success');
			res.send( json_responses);

		} else {
			json_responses.status_code=500;
			console.log(err);
			res.send(json_responses);
		}
  	});

	});
	
	res.send("respond with a resource");
};

exports.doctorRegister = function (req, res){
	console.log (req.body);
	mongo.connect(mongoURL,function() {
	mongo.collection('doctors').insertOne(req.body,function(err, user) { 
		if (user) {
			json_responses.status_code=200;
			console.log('success');
			res.send( json_responses);

		} else {
			json_responses.status_code=500;
			console.log(err);
			res.send(json_responses);
		}
  	});

	});
	
	res.send("respond with a resource");
};

exports.login = function(req,res) {
var email=req.body.email;
var password=req.body.password;
	mongo.connect(mongoURL, function() {
		mongo.collection('user').findOne({
			"email": email,
			"password": password
		}, function(err, result) {
			console.log(result);
			if (err) {
				json_responses.status_code=500;
				json_responses.result=result;
				res.send(json_responses);
			} else if (result) {
				console.log("Found the user", result);
				json_responses.status_code=200;
				json_responses.result=result;
				res.send(json_responses);
			} else {
				console.log("No User found with given credentials");
				json_responses.status_code=400;
				json_responses.result=result;
				res.send(json_responses);
			}
		});
	});
};