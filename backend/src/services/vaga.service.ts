// import { injectable } from "tsyringe";
// import prisma from "../lib/prisma"; // ajuste o path conforme sua estrutura
// import { Vaga } from "../types/vaga.type";
// import { connect } from "http2";

// interface Pagination {
//   page?: number;
//   limit?: number;
// }

// @injectable()
// export class VagaService {
//   constructor() {}

//   /**
//    * Cria ou atualiza uma vaga e suas relações usando $transaction
//    */
//   async saveWithTransaction(vagaData: Vaga) {
//     const {
//       id,
//       titulo,
//       beneficios,
//       habilidades,
//       anexos,
//       localizacao,
//       areaCandidato,
//       clienteId,
//       ...rest
//     } = vagaData;

//     return await prisma.$transaction(async (tx) => {
//       // Verifica duplicidade de título para o mesmo cliente
//       const tituloExiste = await tx.vaga.findFirst({
//         where: {
//           titulo: titulo,
//           clienteId: clienteId,
//           NOT: id ? { id } : undefined,
//         },
//       });

//       if (tituloExiste) {
//         throw new Error(
//           "Já existe uma vaga com este título para este cliente."
//         );
//       }

//       // Criação ou atualização da vaga
//       const vaga = id
//         ? await tx.vaga.update({
//             where: { id },
//             data: {
//               titulo,
//               ...rest,
//               clienteId,
//               localizacao: localizacao?.id
//                 ? { update: localizacao }
//                 : { create: localizacao },
//             },
//           })
//         : await tx.vaga.create({
//             data: {
//               titulo,
//               ...rest,
//               clienteId,
//               localizacaoId: localizacao?.id,
//             },
//           });

//       // Benefícios
//       if (beneficios?.length) {
//         await tx.beneficio.deleteMany({ where: { vagaId: vaga.id } });
//         await tx.beneficio.createMany({
//           data: beneficios.map((b) => ({
//             nome: b.nome,
//             descricao: b.descricao,
//             vagaId: vaga.id,
//           })),
//         });
//       }

//       // Habilidades
//       if (habilidades?.length) {
//         await tx.vagaHabilidade.deleteMany({ where: { vagaId: vaga.id } });
//         await tx.vagaHabilidade.createMany({
//           data: habilidades.map((h) => ({
//             vagaId: vaga.id,
//             habilidadeId: h.habilidadeId,
//             nivelExigido: h.nivelExigido,
//           })),
//         });
//       }

//       // Anexos
//       if (anexos?.length) {
//         await tx.vagaAnexo.deleteMany({ where: { vagaId: vaga.id } });
//         await tx.vagaAnexo.createMany({
//           data: anexos.map((a) => ({
//             vagaId: vaga.id,
//             anexoId: a.anexoId,
//           })),
//         });
//       }

//       return vaga;
//     });
//   }

//   /**
//    * Busca todas as vagas de um cliente com paginação
//    */
//   async getAllByCliente(
//     clienteId: string,
//     { page = 1, limit = 10 }: Pagination
//   ) {
//     const skip = (page - 1) * limit;

//     const [vagas, total] = await prisma.$transaction([
//       prisma.vaga.findMany({
//         where: { clienteId },
//         skip,
//         take: limit,
//         include: {
//           beneficios: true,
//           habilidades: true,
//           anexos: true,
//           localizacao: true,
//           areaCandidato: true,
//         },
//       }),
//       prisma.vaga.count({ where: { clienteId } }),
//     ]);

//     return {
//       data: vagas,
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     };
//   }

//   /**
//    * Busca todas as vagas do sistema com paginação
//    */
//   async getAll({ page = 1, limit = 10 }: Pagination) {
//     const skip = (page - 1) * limit;

//     const [vagas, total] = await prisma.$transaction([
//       prisma.vaga.findMany({
//         skip,
//         take: limit,
//         include: {
//           beneficios: true,
//           habilidades: true,
//           anexos: true,
//           localizacao: true,
//           areaCandidato: true,
//         },
//       }),
//       prisma.vaga.count(),
//     ]);

//     return {
//       data: vagas,
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     };
//   }

//   /**
//    * Busca vaga por ID
//    */
//   async getById(id: string) {
//     const vaga = await prisma.vaga.findUnique({
//       where: { id },
//       include: {
//         beneficios: true,
//         habilidades: true,
//         anexos: true,
//         localizacao: true,
//         areaCandidato: true,
//         cliente: true,
//       },
//     });

//     if (!vaga) {
//       throw new Error("Vaga não encontrada.");
//     }

//     return vaga;
//   }
// }
