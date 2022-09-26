import { Router } from "express";
import { checkAuth } from "../utils/checkAuth.js";
import {createComment, getUserComments} from "../controllers/comment.js";

const router = new Router();

// Create comment
// http://localhost:3002/api/comments/create/:id
router.post("/create/:id", checkAuth, createComment);
// Get user comments
// http://localhost:3002/api/comments/:userId
router.get('/:userId', checkAuth, getUserComments)

export default router;
