var mongo = require("./mongo");
var mongoURL = "mongodb://cmpe295:cmpe295@ds161630.mlab.com:61630/radon";
var json_responses={};
exports.patientRegister = function (req, res){
	console.log (req.body);
	mongo.connect(mongoURL,function() {
		mongo.collection('user').findOne({
			"email": req.body.email
		}, function(err, result) {
			
			if (err) {
				//internal error
				json_responses.status_code=500;
				console.log(err);
				res.send(json_responses);

			} else if (result) {
				//user already exists
			json_responses.status_code=400;
				console.log(err);
				res.send(json_responses);

			} else {
				//unique email
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
			}

			
		});
		
	

	});
	
};

exports.doctorRegister = function (req, res){
	console.log (req.body);
	mongo.connect(mongoURL,function() {
		mongo.collection('doctors').findOne({
			"email": req.body.email
		}, function(err, result) {
			
			if (err) {
				//internal error
				json_responses.status_code=500;
				console.log(err);
				res.send(json_responses);

			} else if (result) {
				//user already exists
			json_responses.status_code=400;
				console.log(err);
				res.send(json_responses);

			} else {
				//unique email
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
			}

			
		});
		
	

	});
};

exports.login = function(req,res) {
var email=req.body.email;
var password=req.body.password;
var type=req.body.type;
	mongo.connect(mongoURL, function() {
		mongo.collection(type).findOne({
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

exports.findUser = function(username, password,type, callback) {

	
	mongo.connect(mongoURL, function() {
		mongo.collection(type).findOne({
			"email": username,
			"password": password
		}, function(err, result) {
	//		console.log(result);
			if (err) {
				console.log(err);
				callback(err,null);
			} else if (result) {
			//	console.log("Found the user", result);
				result.type=type;
				callback(null, result);
			} else {
				console.log("No User found with given credentials");
				callback(null, null);
			}
		});
	});
};

exports.findUserById = function(username, callback){

	var arr=username.split(" ");
	mongo.connect(mongoURL, function() {


		mongo.collection(arr[1]).findOne({
			"email": arr[0]
		}, function(err, result) {
			
			if (err) {
				console.log(err);
				callback(err);

			} else if (result) {
			//	console.log("Found the user", result);
				callback(null, result);

			} else {
				console.log("No User found with given credentials");
				callback(null, false);
			}

			
		});

	});

};