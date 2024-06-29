const express = require("express");
const router = express.Router();


const {sendMessage, getMessage} = require("../controllers/Messages");
const { auth } = require("../middlewares/auth");


router.post("/send/:id", auth, sendMessage);
router.get("/:id", auth, getMessage);


module.exports = router;