module.exports = function(req, res, next) {
    if (req.isAuthenticated() && req.user.emailid==="adminmafia" || req.user.emailid==="adminmafia1") {
      return next();
    } else {
      req.session.errorMessage = 'Access denied. Admins only.';
      res.redirect('/dashboard');
    }
}
  