const express = require("express");

const {
  registerUser,
  loginUser,
  getMe,
  changePassword,
  getAllUsers,
  
} = require("../controllers/authController");
const authMiddleware = require(
    "../middleware/authMiddleware"
);
const authorize = require(
  "../middleware/roleMiddleware"
);

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);
router.get(
    "/me",
    authMiddleware,
    getMe
);
router.put(
  "/change-password",
  authMiddleware,
  changePassword
);
router.get(
  "/users",
  authMiddleware,
  authorize("admin"),
  getAllUsers
);
module.exports = router;