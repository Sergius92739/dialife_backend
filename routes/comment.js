import { Router } from "express";
import { checkAuth } from "../utils/checkAuth.js";
import {createComment} from "../controllers/comment.js";

const router = new Router();

// Create comment
// http://localhost:3002/api/comments/create/:id
router.post("/create/:id", checkAuth, createComment);

export default router;
