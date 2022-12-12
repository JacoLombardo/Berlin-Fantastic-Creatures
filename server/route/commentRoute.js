import express from 'express';
import { getAllComments, getCommentsByPostId, deleteComment, shareComment, likeComment, removeLike, updateComment } from '../controller/commentController.js';


const router = express.Router();

router.get('/all', getAllComments);
router.get('/comment', getCommentsByPostId);
router.post('/share', shareComment);
router.post('/delete', deleteComment);
router.post('/update', updateComment);
router.post('/likes', likeComment);
router.post('/removelike', removeLike);

export default router;