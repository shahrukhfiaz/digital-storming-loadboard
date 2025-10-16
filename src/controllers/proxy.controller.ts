import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { createProxy, deleteProxy, listProxies, updateProxy } from '../services/proxy.service';
import { recordAuditLog } from '../services/audit.service';
import type { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../utils/appError';

const proxyCreateSchema = z.object({
  name: z.string().min(1),
  host: z.string().min(1),
  port: z.number().int().min(1).max(65535),
  username: z.string().optional(),
  password: z.string().optional(),
  protocol: z.enum(['HTTP', 'HTTPS', 'SOCKS5']).optional(),
});

const proxyUpdateSchema = proxyCreateSchema.partial().extend({
  isActive: z.boolean().optional(),
  healthStatus: z.enum(['UNKNOWN', 'HEALTHY', 'DEGRADED', 'UNHEALTHY']).optional(),
});

export const listProxiesHandler = asyncHandler(async (_req, res) => {
  const proxies = await listProxies();
  return res.status(200).json(proxies);
});

export const createProxyHandler = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const payload = proxyCreateSchema.parse(req.body);
  const proxy = await createProxy(payload);
  await recordAuditLog({
    actorId: req.user?.id,
    action: 'PROXY_CREATED',
    targetType: 'PROXY',
    targetId: proxy.id,
  });
  return res.status(201).json(proxy);
});

export const updateProxyHandler = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const payload = proxyUpdateSchema.parse(req.body);
  const { id } = req.params;
  if (!id) {
    throw new AppError('Proxy id parameter is required', 400);
  }
  const proxy = await updateProxy(id, payload);
  await recordAuditLog({
    actorId: req.user?.id,
    action: 'PROXY_UPDATED',
    targetType: 'PROXY',
    targetId: proxy.id,
    metadata: payload,
  });
  return res.status(200).json(proxy);
});

export const deleteProxyHandler = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('Proxy id parameter is required', 400);
  }
  await deleteProxy(id);
  await recordAuditLog({
    actorId: req.user?.id,
    action: 'PROXY_DELETED',
    targetType: 'PROXY',
    targetId: id,
  });
  return res.status(204).send();
});