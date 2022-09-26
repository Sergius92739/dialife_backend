import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

// Create comment
export const createComment = async (req, res) => {
    try {
        const {postId, comment, userId, type, commentId} = req.body;

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
                userId: _id,
            }
        } catch (error) {
            console.error(error);
            res.json({message: 'Ошибка идентификации пользователя при создании комментария.'})
        }

        let answerTo;
        if (commentId) {
            try {
                const commentEl = await Comment.findById(commentId);
                const {author, comment} = commentEl;
                answerTo = {...author, comment};
            } catch (error) {
                console.error(error);
                res.json({message: 'Ошибка идентификации комментария'});
            }
        }

        const newComment = new Comment({comment, author, type, answerTo, postId});
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

// Get user comments
export const getUserComments = async (req, res) => {
    try {
        const count = await Comment.countDocuments({userId: req.params.userId})
        res.json({count})
    } catch (error) {
        console.error(error)
        res.json({message: 'Ошибка получения комментариев пользователя.'})
    }
}


