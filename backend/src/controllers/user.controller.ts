import { getAuth } from "firebase-admin/auth";
import { Body, Controller, Delete, Get, HttpError, Param, Post, Put } from "routing-controllers";
import { Authorized } from "../decorators/Authorized";
import { firestoreDB } from "../lib/firebaseAdmin";

@Controller("/users")
export default class UserController {
  private checkFirebaseAvailable(): void {
    if (!firestoreDB) {
      throw new HttpError(503, "Firebase não está configurado. Configure o arquivo de credenciais no root do backend.");
    }
  }

  @Post("/")
  @Authorized()
  async create(@Body() body: { email: string; password: string; name: string; role: string }) {
    this.checkFirebaseAvailable();

    try {
      const { email, password, name, role } = body;

      const userRecord = await getAuth().createUser({
        email,
        password,
        displayName: name,
      });
      await firestoreDB!
        .collection("users")
        .doc(userRecord.uid)
        .set({ email, name, role });

      return { uid: userRecord.uid };
    } catch (error) {
      throw new HttpError(500, "Erro ao criar usuário");
    }
  }

  @Get("/")
  @Authorized()
  async getAll() {
    this.checkFirebaseAvailable();

    try {
      const snapshot = await firestoreDB!.collection("users").get();
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return users;
    } catch (error) {
      throw new HttpError(500, "Erro ao buscar usuários");
    }
  }

  @Get("/:id")
  @Authorized()
  async getOne(@Param("id") id: string) {
    this.checkFirebaseAvailable();

    try {
      const doc = await firestoreDB!
        .collection("users")
        .doc(id)
        .get();
      if (!doc.exists) {
        throw new HttpError(404, "Usuário não encontrado");
      }

      return { id: doc.id, ...doc.data() };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(500, "Erro ao buscar usuário");
    }
  }

  @Put("/:id")
  @Authorized()
  async update(@Param("id") id: string, @Body() body: any) {
    this.checkFirebaseAvailable();

    try {
      await firestoreDB!.collection("users").doc(id).update(body);
      return { message: "Usuário atualizado com sucesso" };
    } catch (error) {
      throw new HttpError(500, "Erro ao atualizar usuário");
    }
  }

  @Delete("/:id")
  @Authorized()
  async delete(@Param("id") id: string) {
    this.checkFirebaseAvailable();

    try {
      await getAuth().deleteUser(id);
      await firestoreDB!.collection("users").doc(id).delete();
      return { message: "Usuário deletado" };
    } catch (error) {
      throw new HttpError(500, "Erro ao deletar usuário");
    }
  }
}
