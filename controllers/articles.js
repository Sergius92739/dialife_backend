import path, {dirname} from "path";
import {fileURLToPath} from "url";
import Article from "../models/Article.js";
import {unlink} from "fs";

// create article
export const createArticle = async (req, res) => {
    try {
        const {title, text} = req.body;

        if (req.files.image.size) {
            const filename = Date.now().toString() + req.files.image.name;
            const __dirname = dirname(fileURLToPath(import.meta.url));
            req.files.image.mv(path.join(__dirname, "..", "uploaded", filename));

            const articleWithImage = new Article({
                title,
                text,
                imgUrl: filename,
            });
            await articleWithImage.save();

            return res.json({message: 'Статья с изображением успешно добавлена.'})
        }

        const articleWithoutImage = new Article({
            title,
            text,
        });
        await articleWithoutImage.save();

        return res.json({message: 'Статья без изображения успешно добавлена.'})
    } catch (error) {
        console.error(error);
    }
}

// Get all articles
export const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find({}).sort("-createdAt");
        const popularArticles = await Article.find({}).limit(5).sort("-views");
        console.log({articles, popularArticles});

        if (!articles) {
            return res.json({message: 'Статей нет.'});
        }

        res.json({articles, popularArticles});
    } catch (error) {
        console.error(error);
        res.json({message: 'Ошибка получения статей.'})
    }
}

// Update articles
export const updateArticle = async (req, res) => {
    try {
        const {text, title} = req.body;
        const {articleId} = req.params;
        const article = await Article.findById(articleId);

        if (req.files.image.size) {
            const {imgUrl} = article;
            if (imgUrl) {
                unlink(`uploaded/${imgUrl}`, (error) => {
                    if (error) {
                        return res.json({message: 'Не удалось удалить старое изображение.'})
                    }
                })
            }
            const filename = Date.now().toString() + req.files.image.name;
            const __dirname = dirname(fileURLToPath(import.meta.url));
            await req.files.image.mv(path.join(__dirname, "..", "uploaded", filename));
            article.imgUrl = filename;
        }

        article.text = text;
        article.title = title;
        await article.save();

        res.json({message: 'Статья успешно обновлена.', article});
    } catch (error) {
        console.error(error);
        res.json({message: 'Ошибка обновления статьи.'})
    }
}

// Delete article
export const deleteArticle = async (req, res) => {
    try {
        const {articleId} = req.params;
        await Article.findByIdAndDelete(articleId);
        res.json({message: 'Статья успешно удалена.'})
    } catch (error) {
        console.error(error);
        res.json({message: 'Ошибка удаления статьи.'})
    }
}

// Get article by ID
export const getArticleById = async (req, res) => {
    try {
        const {articleId} = req.params;
        const article = await Article.findById(articleId);
        res.json(article);
    } catch (error) {
        console.error(error);
        res.json({message: 'Ошибка получения статьи.'})
    }
}

// Get article by ID and update views
export const getArticleByIdAndUpdateViews = async (req, res) => {
    try {
        const {articleId} = req.params;
        const article = await Article.findByIdAndUpdate(articleId, {
            $inc: {views: 1}
        })
        res.json(article);
    } catch (error) {
        console.error(error);
        res.json({message: 'Ошибка получения статьи.'})
    }
}

// Like or dislike the article
export const likeOrDislikeTheArticle = async (req, res) => {
    try {
        const {userId, articleId, type} = req.body;
        const article = await Article.findById(articleId);

        if (article[type].some((el) => el === userId)) {
            article[type] = article[type].filter((el) => el !== userId);
            await article.save();
            res.json({message: `${type === 'likes' ? 'Лайк' : 'Дизлайк'} отменён.`})
        } else {
            article[type].push(userId);
            article[type === 'likes' ? 'dislikes' : 'likes'] = article[type === 'likes' ? 'dislikes' : 'likes'].filter((el) => el !== userId);
            await article.save();
            res.json({message: `${type === 'likes' ? 'Лайк' : 'Дизлайк'} поставлен.`});
        }
    } catch (error) {
        console.error(error);
        res.json({message: 'Ошибка запроса поставить лайк.'})
    }
}

// Get articles count
export const getArticlesCount = async (req, res) => {
    try {
        const articlesCount = await Article.countDocuments({});
        res.json({articlesCount});
    } catch (error) {
        console.error(error);
        res.json({message: 'Ошибка получения количества статей.'})
    }
}
