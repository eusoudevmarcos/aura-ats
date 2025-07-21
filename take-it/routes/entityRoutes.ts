import { Router } from 'express';
import * as entityController from '../controllers/entityController';

const router = Router();

// GET /api/entity/search?query=Empresa X&type=pj&uf=SP
router.get('/search', entityController.search);

// GET /api/entity/details/12345678000199?type=pj
router.get('/details/:document', entityController.getDetails);

export default router;