const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const upload = require("../middleware/multer");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");


// ------- Get Routes
router.get("/", homeController.getIndex);

router.get("/search", ensureAuth, postsController.getSearch);
router.get("/browse", ensureAuth, postsController.getBrowse);
router.get("/reviews", ensureAuth, postsController.getReviews);
router.get("/upload", ensureAuth, postsController.getUpload);

router.post("/sendEmail", ensureAuth, postsController.sendEmail);

// Key Pages
router.get("/view", ensureAuth, postsController.getView);
router.get("/create", ensureAuth, postsController.getCreate);
router.get("/delete", ensureAuth, postsController.getDelete);
router.post("/remover", postsController.deleteReview);

//Keys
router.post("/save", postsController.createKey);
router.post("/remove", postsController.deleteKey);

//Photos
router.post("/review", upload.single("file"), postsController.createReview);

//Auth Signup
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

//Auth Login
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

//Logout
router.get("/logout", authController.logout);

module.exports = router;
