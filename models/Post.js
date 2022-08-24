import mongoose from 'mongoose';
const { Schema } = mongoose;

const postSchema = Schema(
  {
    title: String,
    message: String,
    creator: {
      type: String,
      ref: 'User',
      required: [true, "please provide creator's name"],
    },
    comments: { type: [String], default: [] },
    createdBy: { type: String, ref: 'User', required: true },
    tags: [String],
    selectedFile: String,
    likeCount: [String],
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);
