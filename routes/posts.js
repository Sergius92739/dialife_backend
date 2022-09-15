import { Router } from "express";
import { createPost, getAllPosts, getPostById, likesHandler, dislikesHandler } from "../controllers/posts.js";
import { chechAuth } from "../utils/checkAuth.js";

const router = new Router();

// Create post
// http://localhost:3002/api/posts
router.post("/add", chechAuth, createPost);
// get all posts
router.get("/all", getAllPosts);
// get post by id
router.get("/:id", getPostById);
// put like 
router.get("/:postId/:userId/likes", likesHandler);

router.get("/:postId/:userId/dislikes", dislikesHandler);


export default router;
