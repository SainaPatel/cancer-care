var mongo = require("./mongo");
var mongoURL = "mongodb://doctorSearch:cmpe295@ds163940.mlab.com:63940/betterdoctor";

exports.getDoctors = function(req,res){
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('doctorSearch');
		var curstate=req.param("state");
		console.log("curstate "+curstate);
		var curLat=req.param("lat");
		var curLon=req.param("lon");
		coll.find({"visit_address.state_long": curstate}).toArray(function(err,response)
				{
			if(err)
			{
				console.log("error in getting doctors");
			}else
			{
				console.log("in response"+response.length);
				var resToSend=[];
				response.forEach(function(res){
					var dist=distanceCal(curLat,curLon,res.visit_address.lat,res.visit_address.lon,"K");
					console.log("distCalculated "+dist);
					if(dist<=32.1869)
					{
						resToSend.push(res);
					}
				});
				console.log("resultToSend"+resToSend.length);
				res.send({"result" : resToSend});
			}
				}
		)
	});
}

distanceCal=function(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}