import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { proxyRoutes } from './proxy.routes';
import { domainRoutes } from './domain.routes';
import { sessionRoutes } from './session.routes';
import { auditRoutes } from './audit.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/proxies', proxyRoutes);
router.use('/domains', domainRoutes);
router.use('/sessions', sessionRoutes);
router.use('/audits', auditRoutes);

export const apiRouter = router;
