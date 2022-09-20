import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  getPostAndUpdateViews,
  likesHandler,
  dislikesHandler,
  getMyPosts,
  removePost,
} from "../controllers/posts.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = new Router();

// Create post
// http://localhost:3002/api/posts
router.post("/add", checkAuth, createPost);
// get all posts
router.get("/all", getAllPosts);
// get my posts
router.get("/user", checkAuth, getMyPosts);
// get post by id and update views
router.get("/:id/updateViews", getPostAndUpdateViews);
// get post by id
router.get("/:id", getPostById);
// put like
router.get("/:postId/:userId/likes", likesHandler);
// put dislike
router.get("/:postId/:userId/dislikes", dislikesHandler);
// Remove post
router.delete("/:id", checkAuth, removePost);

export default router;
