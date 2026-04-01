const {
  register,
  login,
  getUser,
  seedAdmin,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getUser);
router.post("/seed-admin", seedAdmin);

module.exports = router;