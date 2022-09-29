import { Router } from "express";
import { register, login, getMe, updateAvatar } from "../controllers/auth.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = new Router();

// http://localhost:3002/api/auth

//Register
router.post("/register", register);

//Login
router.post("/login", login);

//Cet me
router.get("/me", checkAuth, getMe);

// Update avatar
router.put("/update", checkAuth, updateAvatar)

export default router;
