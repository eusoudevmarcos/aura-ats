FROM node:22

WORKDIR /app

# 1. Dependências
COPY package*.json ./
RUN npm install

# 2. Prisma config + pasta prisma (ANTES do generate)
COPY prisma.config.ts ./
COPY prisma ./prisma

# Define DATABASE_URL só para o build
ENV DATABASE_URL="postgresql://fake:fake@localhost:5432/fake"

# 3. Gera o Prisma Client no ambiente Linux
RUN npx prisma generate

# 4. Código da aplicação
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
