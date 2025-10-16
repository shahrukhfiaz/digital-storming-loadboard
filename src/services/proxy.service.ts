import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response } from 'express';

/**
 * Cloud Proxy Service
 * Routes all client requests through the cloud server's IP address
 */

export interface ProxyConfig {
  cloudServerIP: string;
  cloudServerPort: number;
  enabled: boolean;
}

/**
 * Get proxy configuration from environment
 */
export function getProxyConfig(): ProxyConfig {
  return {
    cloudServerIP: process.env.CLOUD_SERVER_IP || process.env.SERVER_IP || 'localhost',
    cloudServerPort: parseInt(process.env.CLOUD_SERVER_PORT || '4000'),
    enabled: process.env.CLOUD_PROXY_ENABLED === 'true' || process.env.NODE_ENV === 'production'
  };
}

/**
 * Create proxy middleware for routing requests through cloud server
 */
export function createCloudProxyMiddleware() {
  const config = getProxyConfig();
  
  if (!config.enabled) {
    console.log('🌐 Cloud proxy disabled - using direct connections');
    return (req: Request, res: Response, next: Function) => next();
  }

  console.log(`🌐 Cloud proxy enabled - routing through ${config.cloudServerIP}:${config.cloudServerPort}`);

  return createProxyMiddleware({
    target: `http://${config.cloudServerIP}:${config.cloudServerPort}`,
    changeOrigin: true,
    logLevel: 'info',
    onProxyReq: (proxyReq, req, res) => {
      // Add headers to identify requests coming through proxy
      proxyReq.setHeader('X-Forwarded-For', req.ip);
      proxyReq.setHeader('X-Real-IP', config.cloudServerIP);
      proxyReq.setHeader('X-Cloud-Proxy', 'true');
      
      console.log(`🔄 Proxying request: ${req.method} ${req.url} -> ${config.cloudServerIP}`);
    },
    onError: (err, req, res) => {
      console.error('❌ Proxy error:', err.message);
      res.status(500).json({ error: 'Proxy connection failed' });
    }
  });
}

/**
 * Get the public IP address of the cloud server
 * This is what external services will see
 */
export async function getCloudServerPublicIP(): Promise<string> {
  try {
    const axios = require('axios');
    const response = await axios.get('https://httpbin.org/ip', { timeout: 5000 });
    return response.data.origin;
  } catch (error) {
    console.error('Failed to get public IP:', error.message);
    return getProxyConfig().cloudServerIP;
  }
}

/**
 * Test if proxy is working correctly
 */
export async function testProxyConnection(): Promise<boolean> {
  try {
    const config = getProxyConfig();
    const axios = require('axios');
    
    // Test connection to the cloud server
    const response = await axios.get(`http://${config.cloudServerIP}:${config.cloudServerPort}/api/v1/healthz`, {
      timeout: 5000
    });
    
    console.log('✅ Cloud proxy connection test successful');
    return response.status === 200;
  } catch (error) {
    console.error('❌ Cloud proxy connection test failed:', error.message);
    return false;
  }
}