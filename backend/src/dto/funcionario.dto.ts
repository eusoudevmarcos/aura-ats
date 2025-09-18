import nonEmptyAndConvertDataDTO from "./nonEmptyAndConvertDataDTO";

// Função que transforma Entity → DTO
export function toUsuarioDTO(usuario: any): any {
  const data = nonEmptyAndConvertDataDTO(usuario);

  return {
    email: data.email,
    tipoUsuario: data.tipoUsuario,
    pessoa: {
      nome: data.pessoa.nome,
      cpf: data.pessoa.cpf,
      dataNascimento: data.pessoa.dataNascimento,
      rg: data.pessoa.rg,
      createdAt: data.pessoa.createdAt,
      updatedAt: data.pessoa.updatedAt,
    },
    funcionario: {
      setor: data.funcionario.setor,
      cargo: data.funcionario.cargo,
    },
  };
}
