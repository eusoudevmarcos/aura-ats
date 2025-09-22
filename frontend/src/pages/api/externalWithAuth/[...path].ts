// pages/api/externalWithAuth/[...path].ts (Ajuste AQUI)
import redis from '@/lib/redis';
import axios from 'axios';
import { parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

const externalBackendApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

async function invalidateGetCache(externalPath: string) {
  let cursor = '0';
  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: `proxy:GET:${externalPath}:*`,
      count: 100,
    });
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(
        `🗑️ Cache invalidado para ${externalPath}: ${keys.length} keys`
      );
    }
    cursor = nextCursor;
  } while (cursor !== '0');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Não autenticado.' });
    }

    const { path } = req.query;
    const externalPath = Array.isArray(path) ? path.join('/') : path;

    const urlToExternalBackend = `/${externalPath}`;
    const reset = '\x1b[0m';
    const green = '\x1b[32m';
    console.log(
      `${green}${process.env.NEXT_PUBLIC_API_URL}/api${urlToExternalBackend}${reset}`
    );

    const cacheKey = `proxy:${req.method}:${externalPath}:${JSON.stringify(
      req.query
    )}`;

    if (process.env.NODE_ENV === 'production') {
      if (req.method === 'GET') {
        const data = await redis.get(cacheKey);

        if (data) {
          return res.status(200).json({ cached: true, ...data });
        }
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    let externalResponse;
    switch (req.method) {
      case 'GET':
        externalResponse = await externalBackendApi.get(urlToExternalBackend, {
          headers,
          params: req.query,
        });
        break;
      case 'POST':
        externalResponse = await externalBackendApi.post(
          urlToExternalBackend,
          req.body,
          { headers }
        );
        if (externalPath) await invalidateGetCache(externalPath);
        break;
      case 'PUT':
        externalResponse = await externalBackendApi.put(
          urlToExternalBackend,
          req.body,
          { headers }
        );
        if (externalPath) await invalidateGetCache(externalPath);
        break;
      case 'DELETE':
        externalResponse = await externalBackendApi.delete(
          urlToExternalBackend,
          { headers, data: req.body }
        );
        if (externalPath) await invalidateGetCache(externalPath);
        break;
      default:
        return res
          .status(405)
          .json({ error: 'Método não permitido nesta rota de proxy.' });
    }

    if (process.env.NODE_ENV === 'production') {
      if (externalResponse?.data) {
        await redis.set(cacheKey, externalResponse?.data, { ex: 300 });
      }
    }

    res.status(externalResponse.status).json(externalResponse.data);
  } catch (error: any) {
    console.log(
      'Erro no proxy da API externa:',
      error.response?.data || error.message
    );
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      error: 'Erro ao se comunicar com a API externa.',
      details: error.response?.data || error.message,
    });
  }
}
