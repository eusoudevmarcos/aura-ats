// src/controllers/DatastoneController.ts

import { Request, Response } from "express";
import axios from "axios";
import { sanitize } from "../utils/sanitize";
import CacheController from "./cache.controller";

const cache = new CacheController();

const BASE_URL = "https://api.datastone.com.br/v1";

// Função de log ajustada para receber apenas os dados relevantes (response.data)
async function log(data: any) {
  try {
    const fs = require("fs");
    const path = require("path");

    // Garante que a pasta de logs existe
    const logsDir = path.join(__dirname, "../public/logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Cria o nome do arquivo com data e hora
    const now = new Date();
    const dateStr = now.toISOString().replace(/:/g, "-").replace(/\..+/, "");
    const logFileName = `log_${dateStr}.json`;
    const logFilePath = path.join(logsDir, logFileName);

    // Salva apenas os dados relevantes no arquivo de log
    fs.writeFileSync(logFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error: any) {
    throw new Error(error?.message ?? error);
  }
}

interface Query {
  query: string;
  tipo: "persons" | "companies";
  uf: string;
  filial: string;
  list: string;
  isDetail: string;
}

export class DatastoneController {
  constructor() {}
  public async search(
    req: Request<{}, {}, {}, Query>,
    res: Response
  ): Promise<void> {
    try {
      const {
        query: input,
        tipo,
        uf = "",
        filial = "",
        list = "",
        isDetail = "false",
      } = req.query;

      if (!input || !tipo) {
        res.status(400).json({
          error: true,
          mensagem: "Parâmetros 'query' e 'tipo' são obrigatórios.",
        });
        return;
      }

      // Sanitiza os dados e identifica tipo e endpoint
      const result = sanitize(input, tipo, {
        uf,
        filial: filial === "true",
        list: list === "true",
      });

      if ("error" in result) {
        res.status(400).json(result);
        return;
      }

      const cached = cache.getFromCacheFileByKey(tipo, result.tipo, input);
      if (cached) {
        res.status(200).json({ status: 200, cache: true, data: cached });
        return;
      }

      const URL = `${BASE_URL}/${result.pathname}?${result.query}`;

      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.DATASTONE_KEY,
        },
      });

      const data = response.data;
      if (isDetail === "true" && data?.[0]?.id) {
        const enriched = await this.detail(data[0], tipo);
        const saveCache = cache.saveCacheFile(tipo, enriched);
        await log({ status: 200, enriched, URL, saveCache });

        res.status(200).json({ status: 200, enriched, saveCache });
      }

      const saveCache = cache.saveCacheFile(tipo, data);
      await log({ status: 200, data, URL, saveCache });

      res.status(200).json({ status: 200, data, saveCache });
    } catch (error: any) {
      await log(error);
      console.error(
        "Erro ao consultar DataStone:",
        error.message ?? JSON.stringify(error)
      );
      res
        .status(500)
        .json({ error: true, mensagem: "Erro interno na consulta da API." });
    }
  }

  private async detail(data: any, tipo: "persons" | "companies"): Promise<any> {
    try {
      const id = data.id;
      const endpoint = tipo === "companies" ? "companies" : "persons";
      const detailUrl = `${BASE_URL}/${endpoint}/${id}`;
      const detailRes = await axios.get(detailUrl, {
        headers: {
          Authorization: process.env.DATASTONE_KEY,
          "Content-Type": "application/json",
        },
      });

      const enriched = detailRes.data;
      // cache.set(cacheKey, enriched);
      return enriched;
    } catch (error: any) {
      throw new Error(error?.message ?? "Erro ao consultar os detalhes");
    }
  }

  public listCache(req: Request, res: Response): void {
    const cacheEntries = cache.readCacheFile();

    res.json(cacheEntries);
  }
}
