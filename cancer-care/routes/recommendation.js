var mongo = require("./mongo");
var mongoURL = "mongodb://cmpe295:cmpe295@ds161630.mlab.com:61630/radon";
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

