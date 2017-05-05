var mongo = require("./mongo");
var mongoURL = "mongodb://cmpe295:cmpe295@ds161630.mlab.com:61630/radon";
var json_responses={};


//db.foo.update({"_id" :ObjectId("4e93037bbf6f1dd3a0a9541a") },{$set : {"new_field":1}})

exports.addFACTL=function(req,res){
	console.log (req.body);
	var FACTL_TOI=req.body.PWB+req.body.FWB+req.body.LCS;
	var FACTG=req.body.PWB+req.body.FWB+req.body.SWB+req.body.EWB;
	var FACTL=req.body.PWB+req.body.FWB+req.body.SWB+req.body.EWB+req.body.LCS;
	var answers=(((req.body.PWBArray.concat(req.body.SWBArray)).concat(req.body.EWBArray)).concat(req.body.FWBArray)).concat(req.body.LCSArray);
	mongo.connect(mongoURL,function() {
	mongo.collection('user').update({"email":req.user.email},
			{$set:
				{
					"PWB":req.body.PWB,
					"SWB":req.body.SWB,
					"EWB": req.body.EWB,
					"FWB":req.body.FWB,
					"LCS":req.body.LCS,
					"FACTL_TOI":FACTL_TOI,
					"FACTG":FACTG,
					"FACTL":FACTL,
					"PWBArray":req.body.PWBArray,
					"SWBArray":req.body.SWBArray,
					"EWBArray":req.body.EWBArray,
					"FWBArray":req.body.FWBArray,
					"LCSArray":req.body.LCSArray,
					"answers":answers
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

exports.getProfileInfo=function(req,res){
	
	if(typeof req.user!='undefined'){
		console.log(req.user);
		json_responses.status_code=200;
		json_responses.result=req.user;
		res.send(json_responses);
	}else{
		json_responses.status_code=500;
		json_responses.data="no results";
		res.send(json_responses);
	}
	
};

exports.updateProfileInfo=function(req,res){
	
	mongo.connect(mongoURL,function() {
		mongo.collection(req.body.type).update({"email":req.body.email},
				{$set:
					{
						"name":req.body.name,
						"state":req.body.state,
						"county": req.body.county,
						"gender":req.body.gender,
						"cancer_type":req.body.cancer_type,
						"treatments":req.body.treatments,
						"stage":req.body.stage
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
}
