import { NotFoundError } from '../errors/CustomError.js';
import Posts from '../models/Post.js';
export const getPosts = async (req, res) => {
  const { page } = req.query;
  const limit = 8;
  const startIndex = (Number(page) - 1) * limit;
  const total = await Posts.countDocuments();

  const post = await Posts.find({}).sort('-_id').limit(limit).skip(startIndex);
  res.status(200).json({
    data: post,
    currentPage: Number(page),
    numberOfPages: Math.ceil(total / limit),
  });
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findById(id);
  res.status(200).json(post);
};

export const createPost = async (req, res) => {
  const { username, userId } = req.user;
  req.body = { ...req.body, creator: username, createdBy: userId };

  const post = await Posts.create(req.body);
  res.status(201).json(post);
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) {
    throw new NotFoundError(`no post match id ${id}`);
  }

  res.status(201).json(post);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findByIdAndDelete(id);
  if (!post) {
    throw new NotFoundError(`no item with id: ${id}`);
  }
  res.json({ message: 'post deleted successfully' });
};

export const likePost = async (req, res) => {
  const {
    params: { id },
    user: { userId },
  } = req;

  const post = await Posts.findById(id);
  if (!post) {
    throw new NotFoundError(`no post with id ${id}`);
  }
  const checkPost = post.likeCount.find((id) => id === userId);
  if (checkPost) {
    const postIndex = post.likeCount.indexOf(userId);
    post.likeCount.splice(postIndex, 1);
  } else {
    post.likeCount.push(userId);
  }
  const likedPost = await Posts.findByIdAndUpdate(
    id,
    { likeCount: post.likeCount },
    { new: true }
  );
  res.status(201).json(likedPost);
};

export const getPostBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  const title = new RegExp(searchQuery, 'i');
  const post = await Posts.find({
    $or: [{ title }, { tags: { $in: tags.split(',') } }],
  });
  res.status(200).json({ data: post });
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const post = await Posts.findById(id);
  post.comments.push(value);

  const updatedPost = await Posts.findByIdAndUpdate(
    id,
    { comments: post.comments },
    { new: 'true' }
  );

  res.status(200).json(updatedPost);
};
