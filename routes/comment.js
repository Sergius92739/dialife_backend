import { Router } from "express";
import { checkAuth } from "../utils/checkAuth.js";
import {createComment, getUserComments, getUserCommentsCount, updateUserComment} from "../controllers/comment.js";

const router = new Router();

// Create comment
// http://localhost:3002/api/comments/create
router.post("/create", checkAuth, createComment);

// Get user comments
// http://localhost:3002/api/comments/:userId
router.get('/user', checkAuth, getUserComments)

// Get user comments count
// http://localhost:3002/api/comments/user/count
router.get('/user/count', checkAuth, getUserCommentsCount)

// Update comments
// http://localhost:3002/api/comments/update
router.put('/update', checkAuth, updateUserComment)

export default router;
