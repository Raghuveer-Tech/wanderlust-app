const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");

router
    .route("/signup")
    .get(userController.renderSignupForm)

    .post(wrapAsync(userController.signup)
);

router
    .route("/login")
    .get(userController.renderLoginForm)

    .post(saveRedirectUrl,
         passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
        }),(userController.login)
    );

//logout
router.get("/logout", userController.logout);

module.exports = router;


//signup page
// router.get("/signup", userController.renderSignupForm);

//signup user
// router.post("/signup", wrapAsync(userController.signup));

//login page
// router.get("/login", userController.renderLoginForm);

// //login
// router.post("/login",saveRedirectUrl, passport.authenticate('local', {
//     failureRedirect: '/login',
//     failureFlash: true
// }),(userController.login));