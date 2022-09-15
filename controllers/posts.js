import Post from "../models/Post.js";
import User from "../models/User.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Create post
export const createPost = async (req, res) => {
  try {
    const { title, text } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.json({
        message: "Такого юзера не существует.",
      });
    }

    let avatar;

    if (user.avatar) {
      avatar = user.avatar;
    } else {
      avatar = "";
    }

    if (req.files.image.size) {
      const filename = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(path.join(__dirname, "..", "uploaded", filename));

      const newPostWithImage = new Post({
        username: user.username,
        avatar,
        title,
        text,
        imgUrl: filename,
        author: req.userId,
      });

      await newPostWithImage.save();
      await User.findByIdAndUpdate(req.userId, {
        $push: { posts: newPostWithImage },
      });

      return res.json({
        newPostWithImage,
        message: "Пост с изображением успешно сохранен.",
      });
    }

    const newPostWithoutImage = new Post({
      username: user.username,
      avatar,
      title,
      text,
      imgUrl: "",
      author: req.userId,
    });

    await newPostWithoutImage.save();
    await User.findByIdAndUpdate(req.userId, {
      $push: { posts: newPostWithoutImage },
    });

    res.json({
      newPostWithoutImage,
      message: "Пост без изображения успешно сохранен.",
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Что-то пошло не так..." });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort("-createdAt");
    const popularPosts = await Post.find().limit(5).sort("-views");

    if (!posts) {
      return res.json({ message: "Постов нет" });
    }

    res.json({ posts, popularPosts });
  } catch (error) {
    console.error(error);
    res.json({ message: "Ошибка запроса всех постов." });
  }
};

// Get Post by Id
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.json(post);
  } catch (error) {
    console.error(error);
    res.json({ message: "Ошибка запроса поста." });
  }
};

// Put like the post
export const likesHandler = async (req, res) => {
  try {
    const { postId, userId } = req.params;
    const post = await Post.findById(postId);

    if (post.likes.some((el) => el === userId)) {
      const _post = await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
      });
      res.json({
        _post,
        message: `Лайк отменён.`,
      });
    } else {
      const _post = await Post.findByIdAndUpdate(postId, {
        $push: { likes: userId },
        $pull: { dislikes: userId },
      });
      res.json({
        _post,
        message: `Лайк поставлен.`,
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      message: `Ошибка запроса поставить лайк.`,
    });
  }
};

export const dislikesHandler = async (req, res) => {
  try {
    const { postId, userId } = req.params;
    const post = await Post.findById(postId);

    if (post.dislikes.some((el) => el === userId)) {
      const _post = await Post.findByIdAndUpdate(postId, {
        $pull: { dislikes: userId },
      });
      res.json({
        _post,
        message: `Дизлайк отменён.`,
      });
    } else {
      const _post = await Post.findByIdAndUpdate(postId, {
        $push: { dislikes: userId },
        $pull: { likes: userId },
      });
      res.json({
        _post,
        message: `Дизлайк поставлен.`,
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      message: `Ошибка запроса поставить дизлайк.`,
    });
  }
};
