module.exports = function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login'); // Redirect to login if not authenticated
  };
  