const router = require('express').Router();

const { catchErrors } = require("../handlers/errorHandler");
const user = require("../controllers/user.controller");

router.post('/login', catchErrors(user.login));
router.post('/register', catchErrors(user.register));


module.exports = router;