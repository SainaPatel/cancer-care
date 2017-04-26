
/*
 * GET home page.
 */

exports.index = function(req, res){

  res.render('patientProfile', { title: 'Circle of Hope' });

};