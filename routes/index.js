/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'Gotong!' })
};

exports.board = function(req, res) {
	res.render('board', { title: 'Gotong!', snapshot: 'XXX' });
};