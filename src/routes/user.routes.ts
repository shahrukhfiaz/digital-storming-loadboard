import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createUserHandler, deleteUserHandler, listUsersHandler, updateUserHandler } from '../controllers/user.controller';

const router = Router();

router.use(authenticate(['SUPER_ADMIN', 'ADMIN']));

router.get('/', listUsersHandler);
router.post('/', createUserHandler);
router.patch('/:id', updateUserHandler);
router.delete('/:id', deleteUserHandler);

export const userRoutes = router;
