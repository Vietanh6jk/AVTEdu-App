const express = require("express");
const AuthController = require("../controller/auth.controller");
const { verifyAccessToken } = require("../helpers/jwt.service");
const router = express.Router();

router
  .route("/signin")
  .post(AuthController.signIn);
router
  .route("/refreshToken")
  .post(AuthController.refreshToken);
router
  .route("/authercationEmail")
  .post(AuthController.AuthercationEmail);
router
  .route("/checkVerificationEmail")
  .get(verifyAccessToken, AuthController.CheckVerificationEmail);
router
  .route("/logout")
  .delete(AuthController.Logout);
router
  .route("/signinAdmin")
  .post(AuthController.signInAdmin);
router
  .route("/getFile")
  .post(AuthController.getFile); 
router
  .route("/signinGiangVien")
  .post(AuthController.signInGiangVien);   

module.exports = router;