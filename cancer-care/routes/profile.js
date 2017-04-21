var mongo = require("./mongo");
var mongoURL = "mongodb://cmpe295:cmpe295@ds161630.mlab.com:61630/radon";
var json_responses={};


//db.foo.update({"_id" :ObjectId("4e93037bbf6f1dd3a0a9541a") },{$set : {"new_field":1}})

exports.addFACTL=function(req,res){
	console.log (req.body);
	var FACTL_TOI=req.body.PWB+req.body.FWB+req.body.LCS;
	var FACTG=req.body.PWB+req.body.FWB+req.body.SWB+req.body.EWB;
	var FACTL=req.body.PWB+req.body.FWB+req.body.SWB+req.body.EWB+req.body.LCS;
	mongo.connect(mongoURL,function() {
	mongo.collection('user').update({"email":req.body.email},
			{$set:
				{
					"PWB":req.body.PWB,
					"SWB":req.body.SWB,
					"EWB": req.body.EWB,
					"FWB":req.body.FWB,
					"LCS":req.body.LCS,
					"FACTL_TOI":FACTL_TOI,
					"FACTG":FACTG,
					"FACTL":FACTL
				}
			},
			function(err, user) { 
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
