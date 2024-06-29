const express = require("express");
const router = express.Router();

const { signup, login, sidebarUser, logout } = require("../controllers/Auth");
const { auth } = require("../middlewares/auth");

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/", auth, sidebarUser);


module.exports = router;
