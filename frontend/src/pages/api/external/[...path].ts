// pages/api/external/[...path].ts (Ajuste AQUI)
import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import axios from "axios";

const externalBackendApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`, // Ex: "https://takeitapi-1.onrender.com"
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Não autenticado." });
    }

    const { path } = req.query;
    const externalPath = Array.isArray(path) ? path.join("/") : path;

    const urlToExternalBackend = `/${externalPath}`;

    console.log(
      `${process.env.NEXT_PUBLIC_API_URL}/api${urlToExternalBackend}`
    );
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    let externalResponse;
    switch (req.method) {
      case "GET":
        externalResponse = await externalBackendApi.get(urlToExternalBackend, {
          headers,
          params: req.query,
        });
        break;
      case "POST":
        externalResponse = await externalBackendApi.post(
          urlToExternalBackend,
          req.body,
          { headers }
        );
        break;
      case "PUT":
        externalResponse = await externalBackendApi.put(
          urlToExternalBackend,
          req.body,
          { headers }
        );
        break;
      case "DELETE":
        externalResponse = await externalBackendApi.delete(
          urlToExternalBackend,
          { headers, data: req.body }
        );
        break;
      default:
        return res
          .status(405)
          .json({ error: "Método não permitido nesta rota de proxy." });
    }

    res.status(externalResponse.status).json(externalResponse.data);
  } catch (error: any) {
    console.error(
      "Erro no proxy da API externa:",
      error.response?.data || error.message
    );
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      error: "Erro ao se comunicar com a API externa.",
      details: error.response?.data || error.message,
    });
  }
}
