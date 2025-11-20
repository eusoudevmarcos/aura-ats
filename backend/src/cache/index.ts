import { LRUCache } from "lru-cache";

const ONE_HOUR = 1000 * 60 * 60;

// Cache LRU configurado para evitar chamadas repetidas ao DataStone
const cache = new LRUCache({ max: 500, ttl: ONE_HOUR });

export default cache;
