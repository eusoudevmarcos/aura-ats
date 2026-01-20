// src/controllers/DatastoneController.ts

import axios from "axios";
import { Controller, Get, QueryParam, Req, Res } from "routing-controllers";
import { Request, Response } from "express";
import nonEmptyAndConvertDataDTO from "../dto/nonEmptyAndConvertDataDTO";
import prisma from "../lib/prisma";
import { sanitize, SearchType } from "../utils/sanitize";
import CacheController, { CacheEntryPayload } from "./cache.controller";

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

export interface Query {
  query: string;
  tipo: "persons" | "companies";
  uf: string;
  filial: string;
  list: string;
  isDetail: string;
  typeData: SearchType;
}

@Controller("/take-it")
export class DatastoneController {
  constructor() {}
  
  @Get("/search")
  public async search(
    @QueryParam("query", { required: false }) input: string,
    @QueryParam("tipo", { required: false }) tipo: "persons" | "companies",
    @QueryParam("typeData", { required: false }) typeData: SearchType,
    @QueryParam("uf", { required: false }) uf: string = "",
    @QueryParam("filial", { required: false }) filial: string = "",
    @QueryParam("list", { required: false }) list: string = "",
    @QueryParam("isDetail", { required: false }) isDetail: string = "false",
    @Res() res: Response
  ): Promise<void> {
    try {
      if (!input || !tipo) {
        res.status(400).json({
          error: true,
          mensagem: "Parâmetros 'query' e 'tipo' são obrigatórios.",
        });
        return;
      }

      const result = sanitize(input, tipo, typeData, {
        uf,
        filial: filial === "true",
        list: list === "true",
      });

      if ("error" in result) {
        res.status(400).json(result);
        return;
      }

      if (!typeData) {
        throw new Error("typeData é obrigatório");
      }

      const key = cache.buildKey({ typeData: result.tipo, input });

      const cachedPayload = cache.getCachedRequest(key);
      let candidato = null;
      let cliente = null;
      let isSave = false;

      if (result.tipo === "CPF") {
        candidato = await prisma.candidato.findFirst({
          where: { pessoa: { cpf: input } },
        });

        let pessoa = null;
        if (!candidato) {
          pessoa = await prisma.pessoa.findFirst({
            where: { cpf: input },
          });
        }

        isSave = candidato || pessoa ? true : false;
      } else if (result.tipo === "CNPJ") {
        cliente = await prisma.cliente.findFirst({
          where: { empresa: { cnpj: input } },
        });

        isSave = cliente ? true : false;
      }

      if (cachedPayload) {
        cachedPayload.isSave = isSave;
        cachedPayload.candidato = candidato;
        cachedPayload.cliente = cliente;
      }

      const cachedPayloadFormat = nonEmptyAndConvertDataDTO(cachedPayload);

      if (cachedPayload) {
        res
          .status(200)
          .json({ status: 200, cache: true, ...cachedPayloadFormat });
        return;
      }

      const URL = `${BASE_URL}/${result.pathname}?${result.query}`;

      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.DATASTONE_KEY,
        },
      });

      const dataFromApi = this.ensureArray(response.data);

      const payload: CacheEntryPayload = {
        data: dataFromApi,
        isSave,
        candidato: candidato && candidato.id ? { id: candidato.id } : null,
        cliente: cliente && cliente.id ? { id: cliente.id } : null,
        tipo,
        typeData: result.tipo,
        request: {
          input,
          uf,
          filial: filial === "true",
          list: list === "true",
          isDetail: isDetail === "true" || result.isDetail,
          query: result.query,
          tipo,
          typeData: result.tipo,
          url: URL,
        },
        meta: {
          fetchedAt: new Date().toISOString(),
        },
      };

      // if (isDetail === "true" && data?.[0]?.id) {
      //   const enriched = await this.detail(data[0], tipo);
      //   const saveCache = cache.saveCacheFile(tipo, enriched);
      //   await log({ status: 200, enriched, URL, saveCache });

      //   res.status(200).json({ status: 200, enriched, saveCache });
      // }

      const saveCache = cache.saveCachedRequest(
        cache.buildKey({ typeData: result.tipo, input }),
        payload
      );

      await log({ status: 200, data: payload, URL, cacheKey: saveCache?.key });

      res.status(200).json({ status: 200, cache: !!saveCache, ...payload });
    } catch (error: any) {
      await log(error);
      console.log(
        "Erro ao consultar DataStone:",
        error?.message ?? JSON.stringify(error)
      );

      res.status(error?.status).json({
        error: true,
        mensagem: `Erro interno na consulta da API. Verifique sua conta ou entre me contato com um Administrador. STATUS: ${error?.status}`,
      });
    }
  }

  private ensureArray(responseData: any): any[] {
    function padCpfCnpj(obj: any) {
      if (!obj || typeof obj !== "object") return obj;

      // CPF: 11 dígitos, CNPJ: 14 dígitos
      if (
        typeof obj.cpf === "string" &&
        obj.cpf.replace(/\D/g, "").length < 11
      ) {
        const value = obj.cpf.replace(/\D/g, "");
        obj.cpf = value.padStart(11, "0");
      }
      if (
        typeof obj.cnpj === "string" &&
        obj.cnpj.replace(/\D/g, "").length < 14
      ) {
        const value = obj.cnpj.replace(/\D/g, "");
        obj.cnpj = value.padStart(14, "0");
      }
      return obj;
    }

    let arr: any[] = [];
    if (Array.isArray(responseData)) {
      arr = responseData.map(padCpfCnpj);
    } else if (Array.isArray(responseData?.data)) {
      arr = responseData.data.map(padCpfCnpj);
    } else if (responseData?.data && typeof responseData.data === "object") {
      arr = [padCpfCnpj(responseData.data)];
    } else if (responseData && typeof responseData === "object") {
      arr = [padCpfCnpj(responseData)];
    }

    // Converte todas as datas da estrutura para padrão BR, profundamente
    arr = arr.map((item) => nonEmptyAndConvertDataDTO(item));
    return arr;
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

  @Get("/cache")
  public listCache(): CacheEntryPayload {
    const cacheEntries = cache.listCachedEntries();
    return cacheEntries as any;
  }
}
