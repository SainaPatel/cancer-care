var mongo = require("./mongo");
//var mongoURL = "mongodb://cmpe295:cmpe295@ds161630.mlab.com:61630/radon";
var mongoURL = "mongodb://localhost:27017/test";
var json_responses={};

exports.getRadonInfo=function(req,res){
	var county="Alameda County";
	var state="California";
	
	mongo.connect(mongoURL,function(){
		var coll=mongo.collection('regions');
		coll.findOne({
		    "county": county,
		    "state":state
		},function(err, region){
			if (region) {
				json_responses.status_code=200;
				json_responses.data=region;
				console.log(region);
				res.send( json_responses);

			} else {
				json_responses.status_code=500;
				console.log(err);
				res.send(json_responses);
			}
		});
	});
	
};

exports.getLifestyleArticles = function(req,res){
	console.log("getLifestyleArticles called");
	var keywords = ["/Health/","/Depression/"];
	var rx = [];
keywords.forEach(function name(value) {
    var v = value.replace(/\//ig,"");
    rx.push(new RegExp(v));
});
console.log("Regex: " +rx);
	mongo.connect(mongoURL,function(){
		var coll=mongo.collection('articles');
		coll.find({
		    "Keywords" : { $in: rx}
		}).toArray(function(err, articles){
			if (articles) {
				json_responses.status_code=200;
				json_responses.data=articles;
				console.log("Success!");
				console.log(articles);	
				res.send( json_responses);

			} else {
				json_responses.status_code=500;
				console.log("Error");
				console.log(err);
				res.send(json_responses);
			}
		});
	});
	//var response = {"status_code":200, "message":"success"};
	//res.send(json_responses);
};