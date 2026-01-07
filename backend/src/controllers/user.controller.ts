import { Controller, Get, Post, Put, Delete, Param, Body } from "routing-controllers";
import { getAuth } from "firebase-admin/auth";
import { firestoreDB } from "../lib/firebaseAdmin";
import { Authorized } from "../decorators/Authorized";

@Controller("/users")
export default class UserController {
  @Post("/")
  @Authorized()
  async create(@Body() body: { email: string; password: string; name: string; role: string }) {
    const { email, password, name, role } = body;

    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName: name,
    });
    await firestoreDB
      .collection("users")
      .doc(userRecord.uid)
      .set({ email, name, role });

    return { uid: userRecord.uid };
  }

  @Get("/")
  @Authorized()
  async getAll() {
    const snapshot = await firestoreDB.collection("users").get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return users;
  }

  @Get("/:id")
  @Authorized()
  async getOne(@Param("id") id: string) {
    const doc = await firestoreDB
      .collection("users")
      .doc(id)
      .get();
    if (!doc.exists) {
      throw new Error("Usuário não encontrado");
    }

    return { id: doc.id, ...doc.data() };
  }

  @Put("/:id")
  @Authorized()
  async update(@Param("id") id: string, @Body() body: any) {
    await firestoreDB.collection("users").doc(id).update(body);
    return { message: "Usuário atualizado com sucesso" };
  }

  @Delete("/:id")
  @Authorized()
  async delete(@Param("id") id: string) {
    await getAuth().deleteUser(id);
    await firestoreDB.collection("users").doc(id).delete();
    return { message: "Usuário deletado" };
  }
}
