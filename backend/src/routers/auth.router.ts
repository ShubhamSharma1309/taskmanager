import { Router } from 'express';
import { register, login, refreshToken, deleteUser } from '../controllers/auth';
import { authRateLimit } from '../middleware/rateLimiter';
import { authJWT } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', authRateLimit, register);
router.post('/login', authRateLimit, login);
router.post('/refresh-token', authRateLimit, refreshToken);
router.delete('/user/:id', authRateLimit, authJWT, deleteUser);


export default router;  