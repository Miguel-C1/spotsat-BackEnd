import { Router } from 'express';
import polygonRoutes from './polygon.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/polygons', polygonRoutes); // Rotas para polígonos
router.use('', userRoutes);       // Rotas para usuários

export default router;
