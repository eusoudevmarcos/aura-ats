import { LRUCache } from "lru-cache";

const FOUR_HOURS = 1000 * 60 * 60 * 4;
// Cache LRU configurado para evitar chamadas repetidas ao DataStone
const cache = new LRUCache({ max: 500, ttl: FOUR_HOURS });

export default cache;
