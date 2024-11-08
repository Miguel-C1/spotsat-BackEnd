import { Router } from 'express';
import { createPolygon, getPolygons, getPolygonById, updatePolygon, deletePolygon, getPolygonInterests, searchPolygons } from '../controllers/polygon.controller';
import { authMiddleware } from '../middleware/authMiddleware';


const router = Router();

router.post('/', 
    authMiddleware,
    createPolygon);
router.get('/', 
    authMiddleware, 
    getPolygons);
router.get('/:id', 
    //authMiddleware, 
    getPolygonById);
router.put('/:id', 
    authMiddleware, 
    updatePolygon);
router.delete('/:id', 
    authMiddleware,
    deletePolygon);
router.get('/:id/interests', 
    //authMiddleware, 
    getPolygonInterests);
router.get('/search', 
    //authMiddleware, 
    searchPolygons); 

export default router;
