import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        text: {type: String, required: true},
        linkToSource: {type: String, default: ''},
        imgUrl: {type: String, default: ''},
        likes: {type: [String]},
        dislikes: {type: [String]},
        views: {type: Number, default: 0},
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ]
    },
    {
        timestamps: true,
    }
)

export  default mongoose.model('Article', ArticleSchema);