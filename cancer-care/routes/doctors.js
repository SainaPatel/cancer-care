var mongo = require("./mongo");
var mongoURL = "mongodb://doctorSearch:cmpe295@ds163940.mlab.com:63940/betterdoctor";
var supportArticlemongoURL = "mongodb://cmpe295lifestyle:cmpe295@ds111771.mlab.com:11771/circleofhope";
var json_responses = {};

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

exports.getArticles = function (req, res) {
	var keywords = ["/General/", "/Doctor/"];
	console.log("getArticles called:" +req.user.state);	

	var rx = [];
	keywords.forEach(function name(value) {
		var v = value.replace(/\//ig, "");
		rx.push(new RegExp(v));
	});

	mongo.connect(supportArticlemongoURL, function () {
		var coll = mongo.collection('articlesLifestyle');
		coll.find({
			"Keywords": { $in : rx}
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