import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        type: {type: String, required: true},
        answerTo: {
            username: {type: String, default: ''},
            avatar: {type: String, default: ''},
            comment: {type: String, default: ''},
            userId: {type: String, default: ''}
        },
        comment: {type: String, required: true},
        author: {
            username: {type: String, required: true},
            avatar: {type: String, default: ''},
            userId: {type: String, required: true}
        },
        postId: {type: String, required: true}
    },
    {timestamps: true}
);

export default mongoose.model("Comment", CommentSchema);
