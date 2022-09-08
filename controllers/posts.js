import Post from "../models/Post.js";
import User from "../models/User.js";
import path, { dirname } from 'path';
import { fileURLToPath } from "url";

// Create post
export const createPost = async (req, res) => {
  try {
    const { title, text } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.json({
        message: 'Такого юзера не существует.'
      })
    }

    if (req.files.image.size) {
      const filename = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(path.join(__dirname, '..', 'uploaded', filename));

      const newPostWithImage = new Post({
        username: user.username,
        title,
        text,
        imgUrl: filename,
        author: req.userId,
      });

      await newPostWithImage.save();
      await User.findByIdAndUpdate(req.userId, {
        $push: { posts: newPostWithImage }
      });

      return res.json({
        newPostWithImage,
        message: 'Пост с изображением успешно сохранен.'
      });
    }

    const newPostWithoutImage = new Post({
      username: user.username,
      title,
      text,
      imgUrl: '',
      author: req.userId
    });

    await newPostWithoutImage.save();
    await User.findByIdAndUpdate(req.userId, {
      $push: { posts: newPostWithoutImage }
    });

    res.json({
      newPostWithoutImage,
      message: 'Пост без изображения успешно сохранен.'
    })
  } catch (error) {
    console.log(error);
    res.json({ message: 'Что-то пошло не так...' })
  }
}

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort('-createdAt');
    const popularPosts = await Post.find().limit(5).sort('-views');

    if (!posts) {
      return res.json({ message: 'Постов нет' });
    }

    res.json({ posts, popularPosts })
  } catch (error) {
    console.error(error);
    res.json({ message: 'Что-то пошло не так...' })
  }
}