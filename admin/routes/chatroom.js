const Chatroom = require("../controllers/chatroom.controller");
const router = require('express').Router();
const auth = require("../middlewares/auth");

const { catchErrors } = require("../handlers/errorHandler");

router.get("/", auth, catchErrors(Chatroom.list));
router.post("/", auth, catchErrors(Chatroom.create));

module.exports = router;