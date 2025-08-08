import isEqual from "lodash.isequal";
import cache from "../cache"; // Importa o LRUCache configurado
import fs from "fs";
import path from "path";

type CacheKey = "persons" | "companies";
type CacheData = { persons?: any[]; companies?: any[] };

const CACHE_PERSIST_PATH = path.join(
  __dirname,
  "../public/cache/cache_data.json"
);
const CACHE_PERSIST_TTL = 1000 * 60 * 60 * 2; // 2 horas em ms

function getIdentifierKey(key: CacheKey): string {
  return key === "persons" ? "cpf" : "cnpj";
}

function persistCacheToFile(cacheObj: CacheData) {
  try {
    const cacheDir = path.dirname(CACHE_PERSIST_PATH);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    fs.writeFileSync(
      CACHE_PERSIST_PATH,
      JSON.stringify(cacheObj, null, 2),
      "utf-8"
    );
    // Salva também o timestamp de persistência
    fs.writeFileSync(
      CACHE_PERSIST_PATH + ".meta",
      JSON.stringify({ lastPersist: Date.now() }),
      "utf-8"
    );
  } catch (error: any) {
    console.error("Erro ao persistir cache em arquivo:", error.message);
  }
}

function readPersistedCacheFile(): CacheData | null {
  try {
    if (!fs.existsSync(CACHE_PERSIST_PATH)) return null;
    // Verifica se o cache persistente está expirado
    const metaPath = CACHE_PERSIST_PATH + ".meta";
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      if (
        meta.lastPersist &&
        Date.now() - meta.lastPersist > CACHE_PERSIST_TTL
      ) {
        // Expirou, remove arquivo
        fs.unlinkSync(CACHE_PERSIST_PATH);
        fs.unlinkSync(metaPath);
        return null;
      }
    }
    const fileContent = fs.readFileSync(CACHE_PERSIST_PATH, "utf-8");
    return JSON.parse(fileContent);
  } catch (error: any) {
    return null;
  }
}

export default class CacheController {
  saveCacheFile(key: CacheKey, data: any): void {
    try {
      // 1. Lê cache persistente do disco
      let cacheObj: CacheData = readPersistedCacheFile() || {};
      const existingData: any[] = Array.isArray(cacheObj[key])
        ? cacheObj[key]!
        : [];
      const newItems: any[] = Array.isArray(data) ? data : [data];
      const identifierKey = getIdentifierKey(key);

      // 2. Atualiza dados conforme regras de completude
      const updatedData: any[] = [...existingData];
      for (const newItem of newItems) {
        const id = newItem?.[identifierKey];
        if (id == null) continue;

        // Se objeto exatamente igual já existir, ignora
        const alreadyExists = existingData.some((item) =>
          isEqual(item, newItem)
        );
        if (alreadyExists) continue;

        const index = updatedData.findIndex(
          (item) => String(item?.[identifierKey]) === String(id)
        );

        if (index >= 0) {
          const existingItem = updatedData[index];
          const existingProps = Object.keys(existingItem).length;
          const newProps = Object.keys(newItem).length;
          if (newProps > existingProps) {
            updatedData[index] = newItem;
          }
        } else {
          updatedData.push(newItem);
        }
      }
      cacheObj[key] = updatedData;

      // 3. Atualiza o cache LRU (memória) para cada item individualmente
      for (const item of updatedData) {
        const id = item?.[identifierKey];
        if (id != null) {
          // A chave do LRU será `${key}:${id}`
          cache.set(`${key}:${id}`, item);
        }
      }

      // 4. Persiste o cache atualizado no disco
      persistCacheToFile(cacheObj);
    } catch (error: any) {
      console.error("Erro ao salvar cache:", error.message);
    }
  }

  readCacheFile(tipo?: CacheKey): any {
    // Lê do cache persistente (disco)
    const cacheObj = readPersistedCacheFile();
    if (!cacheObj) return tipo ? [] : {};
    return tipo ? cacheObj[tipo] || [] : cacheObj;
  }

  getFromCacheFileByKey(
    key: CacheKey,
    searchKey: string,
    searchValue: string | number
  ): any {
    try {
      const identifierKey = getIdentifierKey(key);
      const normalize = (val: any) =>
        String(val).toLowerCase().replace(/^0+/, "");

      const normalizedSearch = normalize(searchValue);

      // 1. Tenta buscar no cache LRU (memória) por id exato
      if (searchKey === identifierKey) {
        const cached = cache.get(`${key}:${normalizedSearch}`);
        if (cached) return [cached];
      }

      // 2. Busca no cache persistente (disco)
      const cacheData = this.readCacheFile(key);
      if (!Array.isArray(cacheData)) return null;

      // Busca na raiz do objeto
      const rootMatches = cacheData.filter((item: any) => {
        const value = item?.[searchKey];
        if (value !== undefined && value !== null) {
          return normalize(value).includes(normalizedSearch);
        }
        return false;
      });

      if (rootMatches.length > 0) return rootMatches;

      // Busca em subpropriedades
      const containsKeyValue = (obj: any): boolean => {
        if (typeof obj !== "object" || obj === null) return false;
        for (const [k, v] of Object.entries(obj)) {
          if (k === searchKey && v != null) {
            if (normalize(v).includes(normalizedSearch)) return true;
          }
          if (typeof v === "object") {
            if (Array.isArray(v)) {
              if (v.some((el) => containsKeyValue(el))) return true;
            } else {
              if (containsKeyValue(v)) return true;
            }
          }
        }
        return false;
      };

      const nestedMatches = cacheData.filter((item: any) =>
        containsKeyValue(item)
      );

      return nestedMatches.length > 0 ? nestedMatches : null;
    } catch (error: any) {
      console.error("Erro ao buscar no cache:", error.message);
      return null;
    }
  }

  /**
   * Limpa do cache (memória e disco) todos os itens que contenham a subpropriedade informada.
   * Os parâmetros são os mesmos de getFromCacheFileByKey.
   */
  clearCacheBySubproperty(
    key: CacheKey,
    searchKey: string,
    searchValue: string | number
  ): void {
    try {
      const identifierKey = getIdentifierKey(key);
      const normalize = (val: any) =>
        String(val).toLowerCase().replace(/^0+/, "");
      const normalizedSearch = normalize(searchValue);

      // Lê o cache persistente
      let cacheObj: CacheData = readPersistedCacheFile() || {};
      let dataArr: any[] = Array.isArray(cacheObj[key]) ? cacheObj[key]! : [];

      // Função para identificar se o item deve ser removido
      const containsKeyValue = (obj: any): boolean => {
        if (typeof obj !== "object" || obj === null) return false;
        for (const [k, v] of Object.entries(obj)) {
          if (k === searchKey && v != null) {
            if (normalize(v).includes(normalizedSearch)) return true;
          }
          if (typeof v === "object") {
            if (Array.isArray(v)) {
              if (v.some((el) => containsKeyValue(el))) return true;
            } else {
              if (containsKeyValue(v)) return true;
            }
          }
        }
        return false;
      };

      // Filtra os itens que NÃO devem ser removidos
      const filteredData = dataArr.filter(
        (item: any) => !containsKeyValue(item)
      );

      // Remove do cache LRU os itens removidos
      const removedItems = dataArr.filter((item: any) =>
        containsKeyValue(item)
      );
      for (const item of removedItems) {
        const id = item?.[identifierKey];
        if (id != null) {
          cache.delete(`${key}:${id}`);
        }
      }

      // Atualiza o cacheObj e persiste
      cacheObj[key] = filteredData;
      persistCacheToFile(cacheObj);
    } catch (error: any) {
      console.error("Erro ao limpar subpropriedade do cache:", error.message);
    }
  }

  /**
   * Limpa todo o cache (memória e disco).
   */
  clearAllCache(): void {
    try {
      // Limpa o cache LRU (memória)
      cache.clear();

      // Remove os arquivos de cache persistente
      if (fs.existsSync(CACHE_PERSIST_PATH)) {
        fs.unlinkSync(CACHE_PERSIST_PATH);
      }
      const metaPath = CACHE_PERSIST_PATH + ".meta";
      if (fs.existsSync(metaPath)) {
        fs.unlinkSync(metaPath);
      }
    } catch (error: any) {
      console.error("Erro ao limpar todo o cache:", error.message);
    }
  }
}
