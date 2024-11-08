import { Router } from 'express';
import  {loginUser, registerUser, refreshToken} from '../controllers/user.controller';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/refresh', refreshToken);

export default router;