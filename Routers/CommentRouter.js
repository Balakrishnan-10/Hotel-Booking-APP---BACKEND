import express from 'express';
import { verifyToken } from '../Middleware/VerifyToken.js';
import { createComment, deleteComments, editComments, getComments, likeComments } from '../Controllers/CommentController.js';

const router = express.Router();

router.post('/create',verifyToken,createComment)
router.get('/getHotelComments/:hotelId',getComments)
router.put('/likeComments/:commentId',verifyToken,likeComments)
router.put('/edit/:commentId',verifyToken,editComments)
router.delete('/delete/:commentId',verifyToken,deleteComments)

export default router;


