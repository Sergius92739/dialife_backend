import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

// Create comment
export const createComment = async (req, res) => {
    try {
        const {postId, comment, userId} = req.body;

        if (!comment) {
            return res.json({message: 'Комментарий не может быть пустым.'});
        }

        let author;

        try {
            const user = await User.findById(userId);
            const {username, avatar, _id} = user;
            author = {
                username,
                avatar,
                _id,
            }
        } catch (error) {
            console.error(error);
            res.json({message: 'Ошибка идентификации пользователя при создании комментария.'})
        }

        const newComment = new Comment({comment, author});
        await newComment.save();

        try {
            await Post.findByIdAndUpdate(postId, {
                $push: {comments: newComment._id}
            })
        } catch (error) {
            console.error(error);
            res.json({message: 'Ошибка добавления комментария.'})
        }

        res.json({message: 'Комментарий успешно добавлен.'});
    } catch (error) {
        console.log(error);
        res.json({message: "Ошибка создания комментария."});
    }
};


