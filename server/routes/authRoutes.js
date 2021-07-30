const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/forgot-password", AuthController.forgotPassword);
router.patch("/reset-password/:resetToken", AuthController.resetPassword);

module.exports = router;
