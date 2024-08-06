const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

exports.index = (req, res) => {
    res.render("index");
};

exports.renderLoginForm = (req, res) => {
    res.render("login");
};

exports.renderRegisterForm = (req, res) => {
    res.render("register");
};

exports.login = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            req.session.errorMessage = 'User not found!';
            return res.redirect("/login");
        }

        if(user.emailid === "adminmafia" || user.emailid === "adminmafia1"){
            req.session.successMessage = 'Welcome Admin!';
            res.redirect("admindashboard");

        } else {
            req.session.successMessage = 'Login successful!';
            return res.redirect("dashboard");
        }

    } catch (error) {
        req.session.errorMessage = error.message;
        res.redirect("/login");
    }
};

exports.register = async (req, res) => {
    const { firstname, lastname, emailid, password, confirmpassword } = req.body;

    if (password === confirmpassword) {
        try {
            const cart = new Cart({ items: [] });
            await cart.save();

            const user = await User({ emailid });

            if(user){
                req.session.errorMessage = 'User already exists!';
                return res.redirect("/register");
            }

            const registerUser = new User({
                firstname,
                lastname,
                emailid,
                password,
                cart: cart._id
            });

            await registerUser.save();
            req.login(registerUser, (err) => {
                if (err) {
                    req.session.errorMessage = err.message;
                    return res.redirect("/register");
                }
                req.session.successMessage = 'Registration successful!';
                res.redirect("/dashboard");
            });
        } catch (error) {
            req.session.errorMessage = error.message;
            res.redirect("/register");
        }
    } else {
        req.session.errorMessage = 'Passwords do not match !';
        res.redirect("/register");
    }
};

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            req.session.errorMessage = err.message;
            return res.redirect("/dashboard");
        }
        req.session.successMessage = 'Logout successful!';
        res.redirect("/");
    });
};

exports.renderProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'cart',
            populate: {
                path: 'items.productId',
                model: 'Product'
            }
        });
        const orders = await Order.find({ user: req.user._id });

        if (!user) {
            req.session.errorMessage = 'User not found!';
            return res.redirect("/dashboard");
        }
        res.render("profile", { user, cart: user.cart, orders });
    } catch (error) {
        req.session.errorMessage = error.message;
        res.redirect("/dashboard");
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { firstname, lastname, emailid } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            req.session.errorMessage = 'User not found!';
            return res.redirect("/profile");
        }
        
        user.firstname = firstname;
        user.lastname = lastname;
        user.emailid = emailid;
        
        if (req.body.password) {
            user.password = req.body.password;  
        }
        
        await user.save();
        req.session.successMessage = 'Profile updated successfully!';
        res.redirect("/profile");
    } catch (error) {
        req.session.errorMessage = error.message;
        res.redirect("/profile");
    }
};
