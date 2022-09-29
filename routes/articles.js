import {Router} from 'express';
import {checkAuth} from "../utils/checkAuth.js";
import {checkAdmin} from "../utils/checkAdmin.js";
import {
    createArticle,
    deleteArticle,
    getAllArticles,
    getArticleById,
    getArticleByIdAndUpdateViews,
    getArticlesCount,
    likeOrDislikeTheArticle,
    updateArticle
} from "../controllers/articles.js";

const router = new Router();

// Base url http://localhost:3002/api/articles

// create article
// http://localhost:3002/api/articles/create
router.post("/create", checkAuth, checkAdmin, createArticle);

// Get all articles
// http://localhost:3002/api/articles/all
router.get("/all", getAllArticles);

// Like or dislike article
// http://localhost:3002/api/articles/action
router.put("/action", checkAuth, likeOrDislikeTheArticle);

// Get articles count
// http://localhost:3002/api/articles/count
router.get("/count", checkAuth, checkAdmin, getArticlesCount);

// Delete article
// http://localhost:3002/api/articles/:articleId
router.delete("/:articleId", checkAuth, checkAdmin, deleteArticle);

// Get article by ID and update views
// http://localhost:3002/api/articles/:articleId/views
router.get("/:articleId/views", getArticleByIdAndUpdateViews);

// Get article by ID
// http://localhost:3002/api/articles/:articleId
router.get("/:articleId", checkAuth, checkAdmin, getArticleById);

// Update article
// http://localhost:3002/api/articles/:articleId
router.put("/:articleId", checkAuth, checkAdmin, updateArticle);

export default router;