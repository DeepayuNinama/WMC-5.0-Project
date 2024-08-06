require('dotenv').config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");
const hbs = require('hbs');

const paypal = require('paypal-rest-sdk');

const app = express();
const mongoURL = "mongodb+srv://deepayun:Deepayu@1804@gta.uyc3l4a.mongodb.net/?retryWrites=true&w=majority&appName=GTA";
const port = process.env.PORT || 3000;

mongoose.connect(mongoURL)
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  { usernameField: 'emailid' },
  async (emailid, password, done) => {
    try {
      const user = await User.findOne({ emailid });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  res.locals.successMessage = req.session.successMessage;
  res.locals.errorMessage = req.session.errorMessage;
  delete req.session.successMessage;
  delete req.session.errorMessage;
  next();
});

const partialsPath = path.join(__dirname, "../templates/views");
hbs.registerPartials(partialsPath);

const static_path = path.join(__dirname, "../public"); 
const templates_path = path.join(__dirname, "../templates/views");

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


paypal.configure({
  'mode': "sandbox",
  'client_id': "AScAxfn3k2xlAb4Kjzh87kQ6-dOu9wHCuoiEY-1yVOxRtH6Dlumuv_w6IYYjqVUABxheQtiM_AH4WYM0",
  'client_secret': "EPmOr7WyJ764XWbdyyoRxtCCKhFDlsqYYU30u0Gn_jxe_vBmthO1lXq6Xyfra8YigTlKxtMHePu4GAOE"
});

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templates_path);


const authRoutes = require("./routes/authRoute");
const productRoutes = require("./routes/productRoute");

app.use("/", authRoutes);
app.use("/", productRoutes);

app.listen(port, () => {
  console.log(`Server is running at Port no. ${port}`);
});
