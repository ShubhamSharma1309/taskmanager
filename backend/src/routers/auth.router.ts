import { Router } from 'express';
import { register, login, refreshToken, deleteUser } from '../controllers/auth';
import { logout } from '../controllers/auth/logout.controller';
import { authRateLimit } from '../middleware/rateLimiter';
import { authJWT } from '../middleware/authMiddleware';
import { verifyToken } from '../controllers/auth/verify.controller';

const router = Router();

router.post('/register', authRateLimit, register);
router.post('/login', authRateLimit, login);
router.post('/logout', logout);
router.post('/refresh-token', authRateLimit, refreshToken);
router.delete('/user/:id', authJWT, deleteUser);
router.get('/verify', verifyToken);

export default router;