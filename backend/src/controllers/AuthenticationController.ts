import { Request, Response } from "express";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { saveLog } from "../lib/logger";
import { getAuth } from "firebase-admin/auth";
import { firestoreDB } from "../lib/firebaseAdmin";

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY as string;
const SECRET = process.env.JWT_SECRET as string;

export default class AuthenticationController {
  async logIn(req: Request, res: Response) {
    if (req.method !== "POST") return res.status(405).end();
    const { username, password } = req.body;

    try {
      if (!FIREBASE_API_KEY) {
        throw new Error("FIREBASE_API_KEY não configurada.");
      }

      // Login via REST API do Firebase
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: username,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Erro ao autenticar");
      }

      const { idToken, localId, email } = data;

      const token = jwt.sign({ uid: localId, email }, SECRET, {
        expiresIn: "2h",
      });

      res.setHeader(
        "Set-Cookie",
        serialize("token", token, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 2,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
      );

      res.setHeader("Authorization", `Bearer ${token}`);

      await saveLog({
        type: "login",
        status: "success",
        data: {
          email,
          uid: localId,
          firebaseIdToken: idToken,
          token,
        },
      });

      return res.status(200).json({ message: "Login bem-sucedido", token });
    } catch (error: any) {
      await saveLog({
        type: "login",
        status: "error",
        data: { message: error.message },
      });

      console.error("Erro ao logar:", error);
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
  }

  async logOut(req: Request, res: Response) {
    try {
      // Limpar o cookie do token
      res.setHeader(
        "Set-Cookie",
        serialize("token", "", {
          httpOnly: true,
          path: "/",
          maxAge: 0,
        })
      );

      await saveLog({
        type: "logout",
        status: "success",
        data: {},
      });

      return res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (error: any) {
      await saveLog({
        type: "logout",
        status: "error",
        data: { message: error.message },
      });

      console.error("Erro ao fazer logout:", error);
      return res.status(500).json({ error: "Erro ao fazer logout" });
    }
  }

  async register(req: Request, res: Response) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método não permitido" });
    }

    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Nome, email e senha são obrigatórios." });
    }

    const auth = getAuth();

    try {
      let existingUser;
      try {
        existingUser = await auth.getUserByEmail(email);
      } catch (err: any) {
        if (err.code !== "auth/user-not-found") {
          throw err;
        }
      }

      if (existingUser) {
        return res.status(400).json({ message: "Email já está em uso." });
      }

      // Cria o usuário no Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });

      // Salva dados adicionais no Firestore
      await firestoreDB.collection("users").doc(userRecord.uid).set({
        name,
        email,
        createdAt: new Date().toISOString(),
      });

      return res
        .status(201)
        .json({ message: "Usuário registrado com sucesso" });
    } catch (error: any) {
      console.error("Erro no register:", error);
      return res.status(500).json({
        message: error.message || "Erro ao registrar usuário.",
      });
    }
  }
}
