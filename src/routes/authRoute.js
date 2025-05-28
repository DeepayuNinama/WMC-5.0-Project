const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/adminCheck");

// Define routes
router.get("/", authController.index);
router.get("/login", authController.renderLoginForm);
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            req.session.errorMessage = 'An error occurred during authentication.';
            return res.redirect('/login');
        }
        if (!user) {
            req.session.errorMessage = info.message;
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                req.session.errorMessage = 'Login failed.';
                return res.redirect('/login');
            }
            return authController.login(req, res);
        });
    })(req, res, next);
});

router.get("/register", authController.renderRegisterForm);
router.post("/register", authController.register);
router.get("/logout", authController.logout);

router.get("/profile", isAuthenticated, authController.renderProfile);
router.post("/profile/update", isAuthenticated, authController.updateProfile);

module.exports = router;
