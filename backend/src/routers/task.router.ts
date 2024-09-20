import { Router } from 'express';
import { createTask, getAllTasks, getTask, removeTask, updateTask } from '../controllers/tasks';
import { authJWT } from '../middleware/authMiddleware';
const router = Router();

router.post('/create',  authJWT, createTask);
router.get('/get/:id',  authJWT, getTask);
router.get('/getAll',  authJWT, getAllTasks);
router.put('/update/:id',  authJWT, updateTask);
router.delete('/remove/:id',  authJWT, removeTask);

export default router;