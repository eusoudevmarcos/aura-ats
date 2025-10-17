import nonEmptyAndConvertDataDTO from "./nonEmptyAndConvertDataDTO";

// Função que transforma Entity → DTO
export function toUsuarioDTO(usuario: any): any {
  const data = nonEmptyAndConvertDataDTO(usuario);

  return {
    id: data.id,
    email: data.email,
    password: data.password,
    tipoUsuario: data.tipoUsuario,
    funcionario: data.funcionario
      ? {
          id: data.funcionario.id,
          setor: data.funcionario.setor,
          cargo: data.funcionario.cargo,
          pessoa: data.funcionario.pessoa
            ? {
                id: data.funcionario.pessoa.id,
                nome: data.funcionario.pessoa.nome,
                cpf: data.funcionario.pessoa.cpf,
                dataNascimento: data.funcionario.pessoa.dataNascimento,
                rg: data.funcionario.pessoa.rg,
                createdAt: data.funcionario.pessoa.createdAt,
                updatedAt: data.funcionario.pessoa.updatedAt,
              }
            : undefined,
        }
      : undefined,
    cliente: data.cliente
      ? {
          empresa: data.cliente.empresa
            ? {
                id: data.cliente.empresa.id,
                razaoSocial: data.cliente.empresa.razaoSocial,
                cnpj: data.cliente.empresa.cnpj,
                dataAbertura: data.cliente.empresa.dataAbertura,
                createdAt: data.cliente.empresa.createdAt,
                updatedAt: data.cliente.empresa.updatedAt,
              }
            : undefined,
        }
      : undefined,
  };
}
