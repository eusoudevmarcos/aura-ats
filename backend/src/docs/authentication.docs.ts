import {
  Body,
  Controller,
  Example,
  Post,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";

type LoginRequest = {
  username: string;
  password: string;
};

type LoginResponse = {
  message: string;
  uid: number;
  token: string;
};

type LogoutResponse = {
  message: string;
};

type RegisterResponse = {
  message: string;
};

type ErrorResponse = {
  error: string;
};

@Route("auth")
@Tags("Autenticação")
export class AuthenticationDocsController extends Controller {
  @Post("login")
  @Example<LoginResponse>({
    message: "Login bem-sucedido",
    uid: 42,
    token: "jwt.token.aqui",
  })
  @Response<ErrorResponse>(400, "Credenciais ausentes", {
    error: "Email e senha são obrigatórios.",
  })
  @Response<ErrorResponse>(401, "Credenciais inválidas", {
    error: "Credenciais inválidas",
  })
  @Response<ErrorResponse>(404, "Usuário não encontrado", {
    error: "Dados não encontrados",
  })
  public async logIn(@Body() _body: LoginRequest): Promise<LoginResponse> {
    throw new Error("Método usado apenas para geração de documentação.");
  }

  @Post("logout")
  @Security("bearerAuth")
  @Example<LogoutResponse>({
    message: "Logout realizado com sucesso",
  })
  public async logOut(): Promise<LogoutResponse> {
    throw new Error("Método usado apenas para geração de documentação.");
  }

  @Post("register")
  @Response<RegisterResponse>(501, "Funcionalidade não implementada", {
    message: "Registro de usuário não implementado para Prisma.",
  })
  public async register(): Promise<RegisterResponse> {
    throw new Error("Método usado apenas para geração de documentação.");
  }
}
