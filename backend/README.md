
## Sumário

- [Prisma](#prisma)
  - [Generate](#generate)
  - [Migrate](#migrate)
- [Env](#env)
  - [Gerar token](#gerar-token)
  - [Firebase](#firebase)
  - [Data Stone API](#data-stone-api)

## Prisma

### Generate
Para gerar os arquivos de tipagem do Prisma, utilize o comando `npm run db:migrate` (consulte o package.json em "scripts").

### Migrate
Para realizar a migration, utilize o comando `npm run migrate:dev`.

> **Aviso:** Não use o "npx" do Prisma para executar o Prisma. Ao utilizar o "split mode" de arquivos, ou seja, separação de entidades por arquivos, é necessário usar a flag "--schema", que já está configurada nos comandos acima. Portanto, MUITO CUIDADO.

## Env

O arquivo de variáveis de ambiente de desenvolvimento está disponível como `.env.local` de exemplo. Para utilizá-lo, duplique o arquivo e renomeie para `.env`. O arquivo ficará mais escuro e exportará as variáveis necessárias automaticamente.

### Gerar token

O JWT deve ser igual tanto para o front-end quanto para o back-end. Em caso de dúvida sobre qual token usar, utilize o arquivo `gerar-token` na raiz do projeto para gerar um novo token. Esse token deve ser utilizado tanto no `.env` do front-end quanto do back-end, pois faz parte da comunicação entre o #next-auth e o #jwt-express.

### Firebase

Para ter acesso ao Firebase é necessário obter o arquivo admin gerado através do Firebase. Entre em contato com alguém que possua as devidas permissões.

Como gerar a chave privada:

- Acesse o Firebase Console;
- Clique em "Configurações do projeto";
- Acesse "Contas de serviço" no menu;
- No final da tela, clique no botão "Gerar nova chave privada";
- Coloque a chave privada no diretório se existir, ou crie o diretório caso não exista:

```
src/public/etc/sectes/firebase-admin.json
```

Após adicionar o arquivo, confira no `.env` se a variável `FIREBASE_ADMIN_SDK_PATH` está configurada com o nome do arquivo do firebase-admin. O arquivo `firebaseAdmin.ts` irá automaticamente verificar o caminho e importar as variáveis de ambiente necessárias.

### Data Stone API

Para acesso às credenciais do Data Stone, contate algum administrador.
