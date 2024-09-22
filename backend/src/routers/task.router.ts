import { Router } from 'express';
import { createTask, getAllTasks, getTask, removeTask, updateTask } from '../controllers/tasks';
import { authJWT } from '../middleware/authMiddleware';
import { taskRateLimit } from '../middleware/rateLimiter';
const router = Router();

router.post('/create',  authJWT, taskRateLimit, createTask);
router.get('/get/:id',  authJWT, taskRateLimit, getTask);
router.get('/getAll',  authJWT, taskRateLimit, getAllTasks);
router.put('/update/:id',  authJWT, taskRateLimit, updateTask);
router.delete('/remove/:id',  authJWT, taskRateLimit, removeTask);

export default router;