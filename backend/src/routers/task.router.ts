import { Router } from 'express';
import { authJWT } from '../middleware/authMiddleware';
import { createTask, getAllTasks, getTask, removeTask, updateTask } from '../controllers/tasks';
import { apiRateLimit } from '../middleware/rateLimiter';
const router = Router();

router.post('/create', apiRateLimit, authJWT, createTask);
router.get('/get/:id', apiRateLimit, authJWT, getTask);
router.get('/getAll', apiRateLimit, authJWT, getAllTasks);
router.put('/update/:id', apiRateLimit, authJWT, updateTask);
router.delete('/remove/:id', apiRateLimit, authJWT, removeTask);

export default router;