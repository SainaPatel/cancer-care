var mongo = require("./mongo");
var mongoURL = "mongodb://295ATreatments:295A@ds123381.mlab.com:23381/treatments";
var request = require('request');
var yelp = require('yelp-fusion');


exports.getRecommendations=function(req,res)
{
	var collection;
	if(req.user.answers!=undefined)
	{
		console.log("user info" + JSON.stringify(req.user.answers));

		var userAnswers=req.user.answers;
		var newData= userAnswers.map(function (x) {
			return x.toString();
		});
		newData.push("4");
		newData.push("0");
		console.log("NewData"+JSON.stringify(newData));
		request.post(
				'https://ibm-watson-ml.mybluemix.net/pm/v1/score/FactL-Calculator?accesskey=rucZP7CLeqbTVw85PCcm1gX8a76oNKjUAnfex0ZMDJBJFkvUxHa3H5EMT4Vb/stqHxGxQ3pIogjgEOjN0TGDTcL0h32gVzPkwMbmHXNpi+Fkertjm3UnGaRXUfTe986JxC8UEnc77nqrI4BC9n7SEwXCPpTKy6c6gKNAIMiHWHE=',
				{ json: {  "tablename":"Fact-L-Calculated-Modified.xls", 
					"header":["GP1", "GP2", "GP3", "GP4", "GP5", "GP6", "GP7","GS1", "GS2","GS3", "GS4", "GS5", "GS6", "GS7", "GE1", "GE2", "GE3", "GE4", "GE5", "GE6", "GF1", "GF2", "GF3", "GF4", "GF5", "GF6", "GF7", "B1", "C2", "L1", "L2", "B5", "C6", "L3", "L4", "Q3", "L5","Factor"], 
					"data":[newData] } },
					function (error, response, body) {

						if (!error && response.statusCode == 200) {
							console.log("in response");
							console.log(JSON.stringify(body));
							console.log("header"+JSON.stringify(body[0].data[0][38]))
							factor=body[0].data[0][38];
						}else
						{
							console.log("error in post call");
						}
					}
		);
		//pwb=req.user.PWB;
		pwb=req.user.PWB;;
		swb=req.user.SWB;
		ewb=req.user.EWB;
		fwb=req.user.FWB;
		collection= pwb<swb && pwb<ewb && pwb<fwb ? 'pwb' : (swb<ewb && swb<fwb ? 'swb' : (ewb<fwb ? 'ewb' : 'fwb'));
	}else{
		collection="general";
	}

//	var collection="swb";
	mongo.connect(mongoURL,function(){
		console.log("Factor "+collection);

		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection(collection);

		coll.findOne(function(err, response) {
			if(err)
			{
				console.log("error in getting cam treatments");
			}else{
				console.log("in response"+response.length);
				res.send({"result":response});
			}
		});

		//		.toArray(function(err,response){
//		if(err)
//		{
//		console.log("error in getting cam treatments");
//		}else{
//		console.log("in response"+response.length);
//		res.send({"result":response});
//		}
//		})
	})


}

exports.getFoodDetails=function(req,res){
	mongo.connect(mongoURL,function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('FoodInfo');
		coll.find().toArray(function(err,response){
			if(err)
			{
				console.log("error in getting cam treatments");
			}else{
				console.log("in response"+response.length);
				res.send({"result":response});
			}
		})
	})


}

exports.getLifestyleDetails=function(req,res){
	mongo.connect(mongoURL,function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('Lifestyle');
		coll.find().toArray(function(err,response){
			if(err)
			{
				console.log("error in getting cam treatments");
			}else{
				console.log("in response"+response.length);
				res.send({"result":response});
			}
		});
	});


};


exports.getTreatmentLocations=function(req,res){
	var term = req.param("treatmentName");
	console.log("term in getTreatmentLocations"+term);
	var lat = "37.3418790";
	var lon = "-121.9242500";
	var clientId = 'KUbmuIidZJ6jNsVJfPS3Dg';
	var clientSecret = 'kQcDMElY8AlceD1Xqr2kIkJ7cfNgFdbnPy9SMBH5361rvFK87u75oGziJNI2cav7';

	var searchRequest = {
			term:term,
			latitude: lat,
			longitude: lon
	};

	yelp.accessToken(clientId, clientSecret).then(function(response,err){
		if(err)
		{
			console.log(err);
		}else
		{
			var client = yelp.client(response.jsonBody.access_token);

			client.search(searchRequest).then(function(response){
				var firstResult = response.jsonBody.businesses[0];
				var prettyJson = JSON.stringify(firstResult, null, 4);
				console.log(prettyJson);
				res.send({result:response.jsonBody.businesses});
			});
		}
	});

};