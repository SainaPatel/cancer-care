var mongo = require("./mongo");
var mongoURL = "mongodb://cmpe295:cmpe295@ds161630.mlab.com:61630/radon";
var json_responses={};

exports.getRadonInfo=function(req,res){
	var county="Alameda";
	var state="California";
	
	mongo.connect(mongoURL,function(){
		var coll=mongo.collection('regions');
				
		
		coll.find({
		    "state":state,
		    "county":county
		}).toArray(function(err, regions){
			if (regions) {
				json_responses.status_code=200;
				json_responses.data=regions;
				console.log(regions);
				res.send( json_responses);

			} else {
				json_responses.status_code=500;
				console.log(err);
				res.send(json_responses);
			}
		});
	});
	
};

exports.getRadonInfoGeneral=function(req,res){
	mongo.connect(mongoURL,function(){
		var coll=mongo.collection('states');
				
		coll.find({},{"code":1,"level":1}).toArray(function(err, states){
			if (states) {
				json_responses.status_code=200;
				json_responses.data=states;
				console.log(states);
				res.send( json_responses);

			} else {
				json_responses.status_code=500;
				console.log(err);
				res.send(json_responses);
			}
		});
	});
};
