import mongoose, { Schema, Document } from "mongoose";

export interface Post extends Document {
  author: mongoose.Types.ObjectId;
  content?: string;
  image?: string;
  likes: mongoose.Types.ObjectId[];
  comments: {
    content: string;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
  }[];
}

const PostSchema: Schema<Post> = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String },
    image: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        content: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const PostModel =
  (mongoose.models.Post as mongoose.Model<Post>) ||
  mongoose.model<Post>("Post", PostSchema);

export default PostModel;
