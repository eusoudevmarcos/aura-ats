-- CreateTable
CREATE TABLE "public"."Funcionario" (
    "id" TEXT NOT NULL,
    "setor" TEXT,
    "cargo" TEXT,
    "usuarioSistemaId" TEXT NOT NULL,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_usuarioSistemaId_key" ON "public"."Funcionario"("usuarioSistemaId");

-- AddForeignKey
ALTER TABLE "public"."Funcionario" ADD CONSTRAINT "Funcionario_usuarioSistemaId_fkey" FOREIGN KEY ("usuarioSistemaId") REFERENCES "public"."UsuarioSistema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
