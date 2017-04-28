var mongo = require("./mongo");
//var mongoURL = "mongodb://cmpe295:cmpe295@ds161630.mlab.com:61630/radon";
var mongoURL = "mongodb://cmpe295lifestyle:cmpe295@ds111771.mlab.com:11771/circleofhope";
var json_responses = {};

exports.getRadonInfo = function (req, res) {
	var county = "Alameda";
	var state = "California";

	mongo.connect(mongoURL, function () {
		var coll = mongo.collection('regions');


		coll.find({
			"state": state,
			"county": county
		}).toArray(function (err, regions) {
			if (regions) {
				json_responses.status_code = 200;
				json_responses.data = regions;
				console.log(regions);
				res.send(json_responses);

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
}

exports.getLifestyleArticles = function (req, res) {
	console.log("getLifestyleArticles called");
	var keywords = ["/Health/", "/Depression/"];
	var rx = [];
	keywords.forEach(function name(value) {
		var v = value.replace(/\//ig, "");
		rx.push(new RegExp(v));
	});
	console.log("Regex: " + rx);
	mongo.connect(mongoURL, function () {
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
}