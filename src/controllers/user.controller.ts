import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { createUser, deleteUser, listUsers, updateUser } from '../services/user.service';
import { recordAuditLog } from '../services/audit.service';
import type { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../utils/appError';

const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'USER']),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'DISABLED']).optional(),
});

const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'SUPPORT', 'USER']).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'DISABLED']).optional(),
});

export const listUsersHandler = asyncHandler(async (req, res) => {
  const skip = req.query.skip ? Number(req.query.skip) : undefined;
  const take = req.query.take ? Number(req.query.take) : undefined;
  const result = await listUsers({ skip, take });
  return res.status(200).json(result);
});

export const createUserHandler = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const payload = userCreateSchema.parse(req.body);
  const user = await createUser(payload);
  await recordAuditLog({
    actorId: req.user?.id,
    action: 'USER_CREATED',
    targetType: 'USER',
    targetId: user.id,
    metadata: { email: user.email, role: user.role },
  });
  return res.status(201).json(user);
});

export const updateUserHandler = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const payload = userUpdateSchema.parse(req.body);
  const { id } = req.params;
  if (!id) {
    throw new AppError('User id parameter is required', 400);
  }
  const user = await updateUser(id, payload);
  await recordAuditLog({
    actorId: req.user?.id,
    action: 'USER_UPDATED',
    targetType: 'USER',
    targetId: user.id,
    metadata: payload,
  });
  return res.status(200).json(user);
});

export const deleteUserHandler = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('User id parameter is required', 400);
  }
  await deleteUser(id);
  await recordAuditLog({
    actorId: req.user?.id,
    action: 'USER_DELETED',
    targetType: 'USER',
    targetId: id,
  });
  return res.status(204).send();
});