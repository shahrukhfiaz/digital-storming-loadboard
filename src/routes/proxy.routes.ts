import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createProxyHandler, deleteProxyHandler, listProxiesHandler, updateProxyHandler } from '../controllers/proxy.controller';

const router = Router();

router.use(authenticate(['SUPER_ADMIN', 'ADMIN']));

router.get('/', listProxiesHandler);
router.post('/', createProxyHandler);
router.patch('/:id', updateProxyHandler);
router.delete('/:id', deleteProxyHandler);

export const proxyRoutes = router;
