import { Router } from 'express';
import { authJWT } from '../middleware/authMiddleware';
import { createTask, getAllTasks, getTask, removeTask, updateTask } from '../controllers/tasks';
import { apiRateLimit } from '../middleware/rateLimiter';
const router = Router();

router.post('/create',  authJWT, createTask);
router.get('/get/:id',  authJWT, getTask);
router.get('/getAll',  authJWT, getAllTasks);
router.put('/update/:id',  authJWT, updateTask);
router.delete('/remove/:id',  authJWT, removeTask);

export default router;