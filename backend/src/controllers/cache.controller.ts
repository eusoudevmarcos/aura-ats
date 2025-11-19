import fs from "fs";
import os from "os";
import path from "path";
import cache from "../cache";
import { SearchType } from "../utils/sanitize";
import { unmask } from "../utils/unmask";

const CACHE_DIR = path.join(__dirname, "../public/cache");
const CACHE_FILE_PATH = path.join(CACHE_DIR, "datastone-cache.json");
const CACHE_TTL = 1000 * 60 * 60; // 1 hora
const MEMORY_THRESHOLD_RATIO = 0.15; // 15% livre mínimo

export interface CacheEntryPayload {
  data: any[];
  request: Record<string, any>;
  meta?: Record<string, any>;
  [key: string]: any;
}

interface CacheEntry {
  key: string;
  typeData: SearchType;
  input: string;
  normalizedInput: string;
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
      console.error("Erro ao ler cache persistido:", error.message);
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
      console.error("Erro ao persistir cache:", error.message);
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

  private normalizeInput(value: string, typeData: SearchType): string {
    if (!value) return "";
    if (typeData === "CPF" || typeData === "CNPJ") {
      return unmask(value);
    }

    return value.trim().toLowerCase();
  }

  private buildKey(typeData: SearchType, input: string): string {
    const normalized = this.normalizeInput(input, typeData);
    return `${typeData}:${normalized}`;
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.createdAt > CACHE_TTL;
  }

  private pruneExpiredEntries(cacheObj: PersistedCache): PersistedCache {
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

  public getCachedRequest(
    typeData: SearchType | undefined,
    input: string | undefined
  ): CacheEntryPayload | null {
    if (!typeData || !input) return null;
    const key = this.buildKey(typeData, input);

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

  public saveCachedRequest(
    typeData: SearchType | undefined,
    input: string,
    payload: CacheEntryPayload
  ): CacheEntry | null {
    if (!typeData || !input) return null;

    const key = this.buildKey(typeData, input);
    const entry: CacheEntry = {
      key,
      input,
      normalizedInput: this.normalizeInput(input, typeData),
      payload,
      typeData,
      createdAt: Date.now(),
    };

    cache.set(key, entry, { ttl: CACHE_TTL });

    const persistedCache = this.readPersistedCache();
    persistedCache[key] = entry;
    this.persistCache(persistedCache);

    return entry;
  }

  public clearAll(): void {
    try {
      cache.clear();
      if (fs.existsSync(CACHE_FILE_PATH)) {
        fs.unlinkSync(CACHE_FILE_PATH);
      }
    } catch (error: any) {
      console.error("Erro ao limpar cache:", error.message);
    }
  }

  public listCachedEntries(): PersistedCache {
    return this.readPersistedCache();
  }
}
