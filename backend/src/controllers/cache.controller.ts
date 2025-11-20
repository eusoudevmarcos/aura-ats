import fs from "fs";
import os from "os";
import path from "path";
import cache from "../cache";

const CACHE_DIR = path.join(__dirname, "../public/cache");
const CACHE_FILE_PATH = path.join(CACHE_DIR, "datastone-cache.json");
const CACHE_TTL = 1000 * 60 * 60; // 1 hora
const MEMORY_THRESHOLD_RATIO = 0.15; // 15% livre mínimo

export interface CacheEntryPayload {
  [key: string]: any;
}

interface CacheEntry {
  key: string;
  payload: CacheEntryPayload;
  createdAt: number;
}

type PersistedCache = Record<string, CacheEntry>;

export default class CacheController {
  private ensureCacheDir(): void {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  }

  private readPersistedCache(): PersistedCache {
    try {
      if (!fs.existsSync(CACHE_FILE_PATH)) {
        return {};
      }
      const content = fs.readFileSync(CACHE_FILE_PATH, "utf-8");
      const parsed = JSON.parse(content) as PersistedCache;
      return this.pruneExpiredEntries(parsed);
    } catch (error: any) {
      console.log("Erro ao ler cache persistido:", error.message);
      return {};
    }
  }

  private persistCache(cacheObj: PersistedCache): void {
    try {
      const safeCache = this.relieveMemoryPressure({ ...cacheObj });
      this.ensureCacheDir();
      fs.writeFileSync(
        CACHE_FILE_PATH,
        JSON.stringify(safeCache, null, 2),
        "utf-8"
      );
    } catch (error: any) {
      console.log("Erro ao persistir cache:", error.message);
    }
  }

  private getMemoryStats() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    return {
      total,
      free,
      used,
      freeRatio: total === 0 ? 0 : free / total,
    };
  }

  private relieveMemoryPressure(cacheObj: PersistedCache): PersistedCache {
    const stats = this.getMemoryStats();
    if (stats.freeRatio > MEMORY_THRESHOLD_RATIO) {
      return cacheObj;
    }

    const sortedEntries = Object.values(cacheObj).sort(
      (a, b) => a.createdAt - b.createdAt
    );

    for (const entry of sortedEntries) {
      const currentStats = this.getMemoryStats();
      if (currentStats.freeRatio > MEMORY_THRESHOLD_RATIO) break;

      delete cacheObj[entry.key];
      cache.delete(entry.key);
    }

    return cacheObj;
  }

  buildKey(...args: (string | Record<string, any>)[]): string {
    // Se for apenas uma string, retorna a própria string
    if (args.length === 1 && typeof args[0] === "string") {
      return args[0];
    }

    // Se for objeto(s), mescla todos os objetos
    const merged = Object.assign(
      {},
      ...args.filter((arg) => typeof arg === "object" && arg !== null)
    );

    // Se não houver propriedades, retorna string vazia
    if (Object.keys(merged).length === 0) {
      return "";
    }

    // Ordena as chaves alfabeticamente para garantir consistência
    const orderedKeys = Object.keys(merged).sort();

    // Concatena apenas os valores normalizados com traço
    const values: string[] = [];
    for (const key of orderedKeys) {
      const value = merged[key];
      // Normaliza: trim + lowercase se for string, senão converte para string
      const normalized =
        typeof value === "string" ? value.trim().toLowerCase() : String(value);
      values.push(normalized);
    }

    return values.join("-");
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.createdAt > CACHE_TTL;
  }
  // @protected
  pruneExpiredEntries(cacheObj: PersistedCache): PersistedCache {
    let mutated = false;
    for (const key of Object.keys(cacheObj)) {
      const entry = cacheObj[key];
      if (!entry || this.isExpired(entry)) {
        mutated = true;
        delete cacheObj[key];
        cache.delete(key);
      }
    }

    if (mutated) {
      this.persistCache(cacheObj);
    }

    return cacheObj;
  }

  getCachedRequest(key: string): CacheEntryPayload | null {
    const inMemory = cache.get(key) as CacheEntry | undefined;
    if (inMemory && !this.isExpired(inMemory)) {
      return inMemory.payload;
    }

    const persistedCache = this.readPersistedCache();
    const entry = persistedCache[key];

    if (!entry || this.isExpired(entry)) {
      if (entry) {
        delete persistedCache[key];
        this.persistCache(persistedCache);
      }
      cache.delete(key);
      return null;
    }

    cache.set(key, entry, { ttl: CACHE_TTL });
    return entry.payload;
  }

  saveCachedRequest(
    key: string,
    payload: CacheEntryPayload
  ): CacheEntry | null {
    const entry: CacheEntry = {
      key,
      payload,
      createdAt: Date.now(),
    };

    cache.set(key, entry, { ttl: CACHE_TTL });

    const persistedCache = this.readPersistedCache();
    persistedCache[key] = entry;
    this.persistCache(persistedCache);

    return entry;
  }

  deleteCacheByKey(key: string) {
    // Remove da memória
    cache.delete(key);

    // Remove do arquivo persistido
    const persistedCache = this.readPersistedCache();
    if (persistedCache[key]) {
      delete persistedCache[key];
      this.persistCache(persistedCache);
    }
  }

  clearAll(): void {
    try {
      cache.clear();
      if (fs.existsSync(CACHE_FILE_PATH)) {
        fs.unlinkSync(CACHE_FILE_PATH);
      }
    } catch (error: any) {
      console.log("Erro ao limpar cache:", error.message);
    }
  }

  listCachedEntries(): PersistedCache {
    return this.readPersistedCache();
  }
}
