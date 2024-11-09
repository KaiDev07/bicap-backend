import express from "express";
import {
    signupUser,
    activate,
    login,
    logout,
    refresh,
    getUsers,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/registration", signupUser);
router.post("/login", login);
router.post("/logout", logout);
router.get("/activate/:link", activate);
router.get("/refresh", refresh);
router.get("/users", authMiddleware, getUsers);

export default router;
