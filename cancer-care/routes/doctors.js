var mongo = require("./mongo");
var mongoURL = "mongodb://sainapatel:Sa27Pat92@ds163940.mlab.com:63940/betterdoctor";

exports.getDoctors=function(req,res){
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('betterDoctor');
	
})
}