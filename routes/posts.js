import express from 'express';
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  likePost,
  getPostBySearch,
  getPost,
  commentPost,
} from '../controllers/posts.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.route('/').get(getPosts).post(auth, createPost);
router.get('/search', getPostBySearch);
router
  .route('/:id')
  .get(getPost)
  .delete(auth, deletePost)
  .patch(auth, updatePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/comments', auth, commentPost);
export default router;
