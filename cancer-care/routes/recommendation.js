var mongo = require("./mongo");
var lifestylemongoURL = "mongodb://cmpe295lifestyle:cmpe295@ds111771.mlab.com:11771/circleofhope";
var mongoURL = "mongodb://cmpe295:cmpe295@ds161630.mlab.com:61630/radon";
var json_responses = {};


exports.getRadonInfo = function (req, res) {
	var county = req.user.county;
	var state = req.user.state;
	mongo.connect(mongoURL, function () {
		var coll = mongo.collection('regions');
		coll.findOne({
			"state": "California",
			"county": "Alameda"
		},{fields:{radon:1}},function (err, regions) {
			if (regions) {
				coll.aggregate( [{ $match: { "state": "California" } },{$group:{_id:"$radon",count :  { $sum : 1 }}}]).toArray(function (err1, result) {
					if (result) {
						console.log(result);
						json_responses.status_code = 200;
						regions.stateZonesCount=result;
						json_responses.data = regions;			
						console.log(regions);
						res.send(json_responses);	
						
					} else {
						json_responses.status_code = 400;
						console.log(err1);
						res.send(json_responses);
					}
				});
			
			} else {
				json_responses.status_code = 500;
				console.log(err);
				res.send(json_responses);
			}
		});
	});
};

exports.getRadonInfoGeneral = function (req, res) {
	mongo.connect(mongoURL, function () {
		var coll = mongo.collection('states');
		coll.find({}, { "code": 1, "level": 1 }).toArray(function (err, states) {
			if (states) {
				json_responses.status_code = 200;
				json_responses.data = states;
				console.log(states);
				res.send(json_responses);
			} else {
				json_responses.status_code = 500;
				console.log(err);
				res.send(json_responses);
			}
		});
	});
};



exports.getArticles = function (req, res) {
	console.log("getLifestyleArticles called:" +req.user.treatments);

	var keywords = [];
	if(req.user.PWBArray[0] < 3){ 
		keywords.push("/Tired/");
		console.log("Keywords" +keywords); 
	}
	if(req.user.PWBArray[1] < 3){ 
		keywords.push("/Nausea/"); 
		console.log("Keywords" +keywords);
	}
	if(req.user.PWBArray[3] < 3){ 
		keywords.push("/Pain/"); 
		console.log("Keywords" +keywords);
	}
	if(req.user.LCSArray[0] < 3){ 
		keywords.push("/Breathing/"); 
		console.log("Keywords" +keywords);
	}
	if(req.user.LCSArray[1] < 3){ 
		keywords.push("/appetite/"); 
		console.log("Keywords" +keywords);
	}
	if(req.user.LCSArray[2] < 3){ 
		keywords.push("/Cough/"); 
		console.log("Keywords" +keywords);
	}
	if(req.user.LCSArray[3] < 3){ 
		keywords.push("/Hair/"); 
		console.log("Keywords" +keywords);
	}
	if(req.user.LCSArray[4] < 3){ 
		keywords.push("/appetite/"); 
		console.log("Keywords" +keywords);
	}
	
	req.user.treatments.forEach(function(item){
		var treatment = "/" +item+ "/";
		keywords.push(treatment);
		console.log("Keywords:" +keywords);
	});

	if(req.user.Type != undefined){
		var type = "/" +req.user.Type+ "/";
		keywords.push(type);
		console.log("Keywords:" +keywords);
	}

	keywords.push("/General/");
	//var keywords = ["/General/", "/Depression/"];
	
	var rx = [];
	keywords.forEach(function name(value) {
		var v = value.replace(/\//ig, "");
		rx.push(new RegExp(v));
	});
	console.log("Regex: " + rx);
	mongo.connect(lifestylemongoURL, function () {
		var coll = mongo.collection('articlesLifestyle');
		coll.find({
			"Keywords": { $in: rx }
		}).toArray(function (err, articles) {
			if (articles) {
				json_responses.status_code = 200;
				json_responses.data = articles;
				console.log("Success!");
				console.log(articles);
				res.send(json_responses);
			} else {
				json_responses.status_code = 500;
				console.log("Error");
				console.log(err);
				res.send(json_responses);
			}
		});
	});
};