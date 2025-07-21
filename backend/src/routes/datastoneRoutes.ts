import express, { Request, Response } from "express";
import axios from "axios";
import { sanitize } from "../utils/sanitize";

const router = express.Router();

router.get("/:search", async (req: Request, res: Response) => {
  const URL = `${process.env.API_DATASTONE}/persons/search/?`;
  const Authorization = "apiKey";

  try {
    const reqSanitize = sanitize(req.params.search);

    if (reqSanitize.error) {
      throw new Error(reqSanitize.mensagem || "Erro de sanitização");
    }

    const response = await axios.get(URL + reqSanitize.url, {
      headers: { Authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({
      code: error?.code,
      status: error?.status,
      message: error?.message,
    });
  }
});

export default router;
