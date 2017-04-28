var mongo = require("./mongo");
var mongoURL = "mongodb://295ATreatments:295A@ds123381.mlab.com:23381/treatments";

exports.getCamTreatments=function(req,res)
{
	mongo.connect(mongoURL,function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('TreatmentInfo');
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