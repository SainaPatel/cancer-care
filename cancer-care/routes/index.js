
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('landing', { title: 'Circle of Hope' });
};