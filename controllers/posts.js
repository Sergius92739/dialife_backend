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

// Get Post by id and update views
export const getPostAndUpdateViews = async (req, res) => {
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

// Get post by id
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (error) {
    console.error(error);
    res.json({ message: error.message });
  }
};

// Put like the post
export const likesHandler = async (req, res) => {
  try {
    const { postId, userId } = req.params;
    const _post = await Post.findById(postId);

    if (_post.likes.some((el) => el === userId)) {
      _post.likes = _post.likes.filter((el) => el !== userId);
      // _post.dislikes = _post.dislikes.filter((el) => el === userId);
      await _post.save();
      res.json({ _post, message: "Лайк отменён." });
    } else {
      _post.likes.push(userId);
      _post.dislikes = _post.dislikes.filter((el) => el !== userId);
      await _post.save();
      res.json({ _post, message: "Лайк поставлен." });
    }
  } catch (error) {
    console.error(error);
    res.json({
      message: `Ошибка запроса поставить лайк.`,
    });
  }
};
// put dislike the post
export const dislikesHandler = async (req, res) => {
  try {
    const { postId, userId } = req.params;
    const _post = await Post.findById(postId);

    if (_post.dislikes.some((el) => el === userId)) {
      _post.dislikes = _post.dislikes.filter((el) => el !== userId);
      await _post.save();
      res.json({ _post, message: "Дизлайк отменён." });
    } else {
      _post.dislikes.push(userId);
      _post.likes = _post.likes.filter((el) => el !== userId);
      await _post.save();
      res.json({ _post, message: "Дизлайк поставлен." });
    }
  } catch (error) {
    console.error(error);
    res.json({
      message: `Ошибка запроса поставить дизлайк.`,
    });
  }
};
// get my Posts
export const getMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const list = await Promise.all(
      user.posts.map((post) => {
        return Post.findById(post._id);
      })
    );
    res.json(list);
  } catch (error) {
    console.log(error);
    res.json({ message: "Ошибка получения постов пользователя." });
  }
};
// Remove post
export const removePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.json({ message: "Такого поста не существует." });
    }
    await User.findByIdAndUpdate(req.userId, {
      $pull: { posts: req.params.id },
    });
    res.json({ postId: req.params.id, message: "Пост был удалён." });
  } catch (error) {
    console.error(error);
    res.json({ message: "Ошибка удаления поста." });
  }
};
// Update post
export const updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, text } = req.body;
    const post = await Post.findById(id);

    if (req.files.image.size) {
      const filename = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(path.join(__dirname, "..", "uploaded", filename));
      post.imgUrl = filename;
    }

    post.title = title;
    post.text = text;
    await post.save();

    res.json({ post, message: "Пост успешно обновлён." });
  } catch (error) {
    console.error(error);
    res.json({ message: "Ошибка обновления поста." });
  }
};
