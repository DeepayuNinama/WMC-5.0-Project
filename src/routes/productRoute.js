const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/adminCheck");
const upload = require("../middleware/upload");

router.get("/creators",  productController.creators);
router.get("/about",  productController.about);
router.get("/dashboard", isAuthenticated, productController.dashboard);
router.get("/dashboard/:id", isAuthenticated, productController.productDetails);
router.get("/sell", isAuthenticated, productController.sell);
router.post("/sell", isAuthenticated, upload, productController.sellProduct);
router.get("/admindashboard", isAuthenticated, isAdmin, productController.admindashboard);
router.post("/admindashboard/:id", isAuthenticated, isAdmin, productController.approveProduct);
router.post("/admindashboard/delete/:id", isAuthenticated, isAdmin, productController.rejectProduct);

router.get("/cart", isAuthenticated, productController.getCart);
router.post("/cart/add", isAuthenticated, productController.addToCart);
router.post("/cart/update", isAuthenticated, productController.updateCart);
router.post("/cart/delete", isAuthenticated, productController.deleteFromCart);


router.post('/pay', isAuthenticated, productController.pay);
router.get('/payment/success', isAuthenticated, productController.paymentSuccess);
router.get('/payment/cancel', isAuthenticated, productController.paymentCancel);

module.exports = router;
