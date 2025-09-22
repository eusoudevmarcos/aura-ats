import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function getAllKeys(match: string = '*'): Promise<string[]> {
  let cursor = '0';
  let keys: string[] = [];

  do {
    const [nextCursor, batch] = await redis.scan(cursor, { match, count: 100 });
    keys = keys.concat(batch);
    cursor = nextCursor;
  } while (cursor !== '0');

  return keys;
}

async function clearAllCache() {
  const keys = await getAllKeys();
  if (keys.length === 0) {
    console.log('Nenhuma chave encontrada no cache.');
    return;
  }

  await redis.del(...keys);
  console.log(`Cache limpo! ${keys.length} chaves deletadas.`);
}

// exemplo de uso
(async () => {
  await clearAllCache();
})();

export default redis;
