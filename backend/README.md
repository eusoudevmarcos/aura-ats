
## Sumário

- [Prisma](#prisma)
  - [Generate](#generate)
  - [Migrate](#migrate)
- [Env](#env)
  - [Gerar token](#gerar-token)
  - [Firebase](#firebase)
  - [Data Stone API](#data-stone-api)
- [Docker](#docker)
  - [Instalação](#instalacao)
  - [Docker Compose - Subir e Descer containers](#docker-compose---subir-e-descer-containers)
  - [Arquivos de configuração](#arquivos-de-configuracao)

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

---

## Docker

### Instalação

Para rodar o backend e o banco de dados em containers, é necessário ter o Docker e o Docker Compose instalados em sua máquina.

- [Instale o Docker Desktop](https://docs.docker.com/get-docker/) (Windows ou Mac)
- Ou siga as instruções oficiais para instalar no [Linux](https://docs.docker.com/engine/install/)

Após a instalação, verifique se está tudo funcionando com:
```bash
docker -v
docker compose version
```

### Docker Compose - Subir e Descer containers

Utilize o Docker Compose para orquestrar os containers do banco de dados (PostgreSQL) e da aplicação backend. Os comandos mais comuns são:

Para **baixar** (parar e remover todos os containers, volumes e rede declarados no docker-compose):

```bash
docker compose down -v
```

Para **subir** (criar e iniciar containers em modo detached):

```bash
docker compose up -d
```

Esses comandos devem ser executados na raiz da pasta `backend`.

### Arquivos de configuração

- **@backend/Dockerfile**  
  Esse arquivo define a construção da imagem do container do backend. Ele especifica a base (Node.js), as etapas de instalação de dependências, configurações para o Prisma Client, cópia de arquivos, e o comando para rodar a aplicação em ambiente de desenvolvimento.

- **@backend/docker-compose.yml**  
  Orquestra múltiplos containers necessários para rodar o sistema em desenvolvimento. Inclui a configuração do banco de dados PostgreSQL com persistência (volume `pgdata`), variáveis de ambiente, mapeamento de portas e dependências, além do serviço do backend que depende do banco.

> Com esses arquivos e comandos, você poderá facilmente rodar toda a stack do projeto em containers Docker padronizados.
