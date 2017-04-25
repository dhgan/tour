module.exports = {
	checkLogin: function(req, res, next) {
		if(!req.session.user) {
			return res.send({
                status: '1024'
            });
		}
		next();
	}
};