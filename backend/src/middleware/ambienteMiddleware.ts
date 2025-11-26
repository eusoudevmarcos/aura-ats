export async function ambienteMiddleware(): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    if (
      process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes("postgres.render.com")
    ) {
      console.warn(
        '\x1b[31m[ALERTA] Você está rodando em ambiente de PRODUÇÃO (DATABASE_URL não contém "localhost")\x1b[0m'
      );

      const requiredPassword = process.env.PASSWORD_ACESS_PROD;
      if (!requiredPassword) {
        console.log(
          "\x1b[31m[ERRO] PASSWORD_ACESS_PROD não está definido no arquivo .env\x1b[0m"
        );
        process.exit(1);
      }

      // Import Node.js built-in readline module
      const readline = await import("readline");

      // Create interface using correct typings
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true,
      });

      // Mostra aviso que a senha não será mascarada
      console.warn(
        "\x1b[33m(Aviso) Por limitações do Node.js, a senha não será mascarada na digitação!\x1b[0m"
      );

      // Função para perguntar usando Promise, não masca a senha
      function questionAsync(query: string): Promise<string> {
        return new Promise((resolve) => {
          rl.question(query, (answer) => resolve(answer));
        });
      }

      // Show prompt and check password
      let userPassword: string;
      try {
        userPassword = await questionAsync(
          "Digite a senha de acesso para o ambiente de produção: "
        );
      } finally {
        rl.close();
      }

      if (userPassword !== requiredPassword) {
        console.log(
          "\x1b[31m[SENHA INCORRETA] A senha fornecida está incorreta. Encerrando a aplicação.\x1b[0m"
        );
        process.exit(1);
      } else {
        console.log(
          "\x1b[32m[SENHA CORRETA] Acesso autorizado para o ambiente de PRODUÇÃO.\x1b[0m"
        );
      }
    }
  }
}
