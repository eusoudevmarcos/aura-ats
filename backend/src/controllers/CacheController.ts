import fs from "fs";
import path from "path";
import isEqual from "lodash.isequal"; // Instale com: npm i lodash.isequal

export default class CacheController {
  saveCacheFile(key: "persons" | "companies", data: any) {
    try {
      const cacheDir = path.join(__dirname, "../public/cache");

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const cacheFilePath = path.join(cacheDir, "cache_data.json");

      // Lê cache atual
      let cacheObj: { persons?: any[]; companies?: any[] } = {};
      const cacheData = this.readCacheFile();

      if (cacheData && typeof cacheData === "object") {
        cacheObj = { ...cacheData };
      }

      const existingData = Array.isArray(cacheObj[key]) ? cacheObj[key] : [];

      const newItems = Array.isArray(data) ? data : [data];

      // Define qual campo usar como identificador
      const identifierKey = key === "persons" ? "cpf" : "cnpj";

      const updatedData = [...existingData];

      for (const newItem of newItems) {
        const id = newItem?.[identifierKey];

        // Ignora se não tiver identificador
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

          // Substitui somente se o novo tiver mais propriedades
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

      fs.writeFileSync(
        cacheFilePath,
        JSON.stringify(cacheObj, null, 2),
        "utf-8"
      );
    } catch (error: any) {
      console.error("Erro ao salvar cache:", error.message);
      return null;
    }
  }

  readCacheFile(tipo?: "persons" | "companies"): any {
    try {
      const logsDir = path.join(__dirname, "../public/cache");
      const filePath = path.join(logsDir, "cache_data.json");

      if (!fs.existsSync(filePath)) return null;

      const fileContent = fs.readFileSync(filePath, "utf-8");
      const json = JSON.parse(fileContent);

      return tipo ? json[tipo] || [] : json;
    } catch (error: any) {
      return null;
    }
  }

  getFromCacheFileByKey(
    key: "persons" | "companies",
    searchKey: string,
    searchValue: string | number
  ): any {
    try {
      const cacheData = this.readCacheFile(key);
      if (!Array.isArray(cacheData)) return null;

      const normalize = (val: any) =>
        String(val).toLowerCase().replace(/^0+/, ""); // remove zeros à esquerda

      const normalizedSearch = normalize(searchValue);

      // 1️⃣ Busca na RAIZ do objeto
      const rootMatches = cacheData.filter((item: any) => {
        const value = item?.[searchKey];
        if (value !== undefined && value !== null) {
          return normalize(value).includes(normalizedSearch);
        }
        return false;
      });

      if (rootMatches.length > 0) return rootMatches;

      // 2️⃣ Busca em subpropriedades
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
}
