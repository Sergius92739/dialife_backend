import { Router } from "express";
import { createPost, getAllPosts } from "../controllers/posts.js";
import { chechAuth } from "../utils/checkAuth.js";

const router = new Router();

// Create post
// http://localhost:3002/api/posts
router.post('/add', chechAuth, createPost);

router.get('/all', getAllPosts)

export default router;