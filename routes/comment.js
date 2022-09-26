import { Router } from "express";
import { checkAuth } from "../utils/checkAuth.js";
import {createComment, getUserComments, getUserCommentsCount} from "../controllers/comment.js";

const router = new Router();

// Create comment
// http://localhost:3002/api/comments/create/:id
router.post("/create/:id", checkAuth, createComment);
// Get user comments
// http://localhost:3002/api/comments/:userId
router.get('/user', checkAuth, getUserComments)
// Get user comments count
// http://localhost:3002/api/comments/count:userId
router.get('/user/count', checkAuth, getUserCommentsCount)

export default router;
