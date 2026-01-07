import { Prisma, TipoEntidade } from "@prisma/client";
import { Request } from "express";
import { inject, injectable } from "tsyringe";
import prisma from "../lib/prisma";
import {
  CardKanbanInput,
  ColunaKanbanInput,
  ComentarioCardInput,
  EspacoTrabalhoInput,
  MoverCardInput,
  MoverColunaInput,
  QuadroKanbanInput,
  VincularEntidadeInput,
} from "../types/kanban.type";
import { SessaoService } from "./sessao.service";

// Tipos de retorno usando Prisma.GetPayload
type EspacoTrabalhoWithQuadros = Prisma.EspacoTrabalhoGetPayload<{
  include: {
    quadros: {
      select: {
        _count: {
          select: {
            colunas: true;
          };
        };
      };
    };
  };
}>;

type EspacoTrabalhoWithQuadrosAndColunas = Prisma.EspacoTrabalhoGetPayload<{
  include: {
    quadros: {
      include: {
        colunas: {
          include: {
            _count: {
              select: {
                cards: true;
              };
            };
          };
        };
      };
    };
  };
}>;

type QuadroCompleto = Prisma.QuadroKanbanGetPayload<{
  include: {
    colunas: {
      include: {
        cards: {
          include: {
            vinculos: {
              include: {
                vaga: {
                  select: {
                    id: true;
                    titulo: true;
                    status: true;
                  };
                };
                candidato: {
                  include: {
                    pessoa: {
                      select: {
                        id: true;
                        nome: true;
                      };
                    };
                  };
                };
                cliente: {
                  include: {
                    empresa: {
                      select: {
                        id: true;
                        razaoSocial: true;
                        nomeFantasia: true;
                      };
                    };
                  };
                };
                compromisso: {
                  select: {
                    id: true;
                    titulo: true;
                    dataHora: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

type VinculoCardWithRelations = Prisma.VinculoCardGetPayload<{
  include: {
    vaga: {
      select: {
        id: true;
        titulo: true;
        status: true;
      };
    };
    candidato: {
      include: {
        pessoa: {
          select: {
            id: true;
            nome: true;
          };
        };
      };
    };
    cliente: {
      include: {
        empresa: {
          select: {
            id: true;
            razaoSocial: true;
            nomeFantasia: true;
          };
        };
      };
    };
    compromisso: {
      select: {
        id: true;
        titulo: true;
        dataHora: true;
      };
    };
  };
}>;

@injectable()
export class KanbanService {
  constructor(@inject(SessaoService) private sessaoService: SessaoService) {}

  /**
   * Extrai o token do request (headers ou cookies)
   */
  private extractTokenFromRequest(req: Request): string | null {
    // 1. Authorization: Bearer
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.split(" ")[1];
    }

    // 2. Cookies
    if (req.headers.cookie) {
      try {
        const cookies = req.headers.cookie.split(";").reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
        return cookies.token || null;
      } catch (e) {
        console.warn("Erro ao parsear cookies:", e);
      }
    }

    return null;
  }

  /**
   * Obtém o usuarioSistemaId a partir do token
   */
  private async getUsuarioSistemaIdFromToken(
    token: string | null | undefined
  ): Promise<string | null> {
    if (!token) return null;
    try {
      const userId = await this.sessaoService.getUserIdFromToken(token);
      return userId || null;
    } catch (error) {
      console.error("Erro ao obter usuarioSistemaId do token:", error);
      return null;
    }
  }

  /**
   * Cria um novo espaço de trabalho
   */
  async criarEspacoTrabalho(data: EspacoTrabalhoInput, token: string | null) {
    const usuarioSistemaId = await this.getUsuarioSistemaIdFromToken(token);
    return await prisma.espacoTrabalho.create({
      data: {
        nome: data.nome,
        usuarioSistemaId,
      },
      include: {
        usuarioSistema: {
          select: {
            id: true,
            email: true,
            funcionario: {
              include: {
                pessoa: {
                  select: {
                    nome: true,
                  },
                },
              },
            },
            cliente: {
              include: {
                empresa: {
                  select: {
                    razaoSocial: true,
                    nomeFantasia: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Lista todos os espaços de trabalho
   */
  async listarEspacosTrabalho(): Promise<EspacoTrabalhoWithQuadros[]> {
    return await prisma.espacoTrabalho.findMany({
      include: {
        usuarioSistema: {
          select: {
            id: true,
            email: true,
            funcionario: {
              include: {
                pessoa: {
                  select: {
                    nome: true,
                  },
                },
              },
            },
            cliente: {
              include: {
                empresa: {
                  select: {
                    razaoSocial: true,
                    nomeFantasia: true,
                  },
                },
              },
            },
          },
        },
        quadros: {
          select: {
            _count: {
              select: {
                colunas: true,
              },
            },
          },
        },
      },
      orderBy: {
        criadoEm: "desc",
      },
    });
  }

  /**
   * Obtém um espaço de trabalho por ID
   */
  async obterEspacoTrabalhoPorId(
    id: string
  ): Promise<EspacoTrabalhoWithQuadrosAndColunas | null> {
    return await prisma.espacoTrabalho.findUnique({
      where: { id },
      include: {
        usuarioSistema: {
          select: {
            id: true,
            email: true,
            funcionario: {
              include: {
                pessoa: {
                  select: {
                    nome: true,
                  },
                },
              },
            },
            cliente: {
              include: {
                empresa: {
                  select: {
                    razaoSocial: true,
                    nomeFantasia: true,
                  },
                },
              },
            },
          },
        },
        quadros: {
          include: {
            usuarioSistema: {
              select: {
                id: true,
                email: true,
                funcionario: {
                  include: {
                    pessoa: {
                      select: {
                        nome: true,
                      },
                    },
                  },
                },
                cliente: {
                  include: {
                    empresa: {
                      select: {
                        razaoSocial: true,
                        nomeFantasia: true,
                      },
                    },
                  },
                },
              },
            },
            colunas: {
              orderBy: { ordem: "asc" },
              include: {
                _count: {
                  select: {
                    cards: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Atualiza um espaço de trabalho
   */
  async atualizarEspacoTrabalho(
    id: string,
    data: Partial<EspacoTrabalhoInput>
  ) {
    return await prisma.espacoTrabalho.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta um espaço de trabalho
   */
  async deletarEspacoTrabalho(id: string) {
    return await prisma.espacoTrabalho.delete({
      where: { id },
    });
  }

  /**
   * Cria um novo quadro Kanban
   */
  async criarQuadroKanban(data: QuadroKanbanInput, token: string | null) {
    const usuarioSistemaId = await this.getUsuarioSistemaIdFromToken(token);
    return await prisma.quadroKanban.create({
      data: {
        titulo: data.titulo,
        espacoTrabalhoId: data.espacoTrabalhoId,
        usuarioSistemaId,
      },
      include: {
        usuarioSistema: {
          select: {
            id: true,
            email: true,
            funcionario: {
              include: {
                pessoa: {
                  select: {
                    nome: true,
                  },
                },
              },
            },
            cliente: {
              include: {
                empresa: {
                  select: {
                    razaoSocial: true,
                    nomeFantasia: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Obtém um quadro Kanban completo com todas as colunas e cards
   */
  async obterQuadroCompleto(quadroId: string): Promise<QuadroCompleto | null> {
    return await prisma.quadroKanban.findUnique({
      where: { id: quadroId },
      include: {
        usuarioSistema: {
          select: {
            id: true,
            email: true,
            funcionario: {
              include: {
                pessoa: {
                  select: {
                    nome: true,
                  },
                },
              },
            },
            cliente: {
              include: {
                empresa: {
                  select: {
                    razaoSocial: true,
                    nomeFantasia: true,
                  },
                },
              },
            },
          },
        },
        colunas: {
          orderBy: { ordem: "asc" },
          include: {
            cards: {
              orderBy: { ordem: "asc" },
              include: {
                usuarioSistema: {
                  select: {
                    id: true,
                    email: true,
                    funcionario: {
                      include: {
                        pessoa: {
                          select: {
                            nome: true,
                          },
                        },
                      },
                    },
                    cliente: {
                      include: {
                        empresa: {
                          select: {
                            razaoSocial: true,
                            nomeFantasia: true,
                          },
                        },
                      },
                    },
                  },
                },
                vinculos: {
                  include: {
                    vaga: {
                      select: {
                        id: true,
                        titulo: true,
                        status: true,
                      },
                    },
                    candidato: {
                      include: {
                        pessoa: {
                          select: {
                            id: true,
                            nome: true,
                          },
                        },
                      },
                    },
                    cliente: {
                      include: {
                        empresa: {
                          select: {
                            id: true,
                            razaoSocial: true,
                            nomeFantasia: true,
                          },
                        },
                      },
                    },
                    compromisso: {
                      select: {
                        id: true,
                        titulo: true,
                        dataHora: true,
                      },
                    },
                  },
                },
                comentarios: {
                  include: {
                    usuarioSistema: {
                      select: {
                        id: true,
                        email: true,
                        funcionario: {
                          include: {
                            pessoa: {
                              select: {
                                nome: true,
                              },
                            },
                          },
                        },
                        cliente: {
                          include: {
                            empresa: {
                              select: {
                                razaoSocial: true,
                                nomeFantasia: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  orderBy: { criadoEm: "desc" },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Atualiza um quadro Kanban
   */
  async atualizarQuadroKanban(id: string, data: Partial<QuadroKanbanInput>) {
    return await prisma.quadroKanban.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta um quadro Kanban
   */
  async deletarQuadroKanban(id: string) {
    return await prisma.quadroKanban.delete({
      where: { id },
    });
  }

  /**
   * Cria uma nova coluna Kanban
   */
  async criarColunaKanban(data: ColunaKanbanInput) {
    // Se não fornecer ordem, busca a última ordem e adiciona 1000
    let ordem = data.ordem;
    if (ordem === undefined) {
      const ultimaColuna = await prisma.colunaKanban.findFirst({
        where: { quadroKanbanId: data.quadroKanbanId },
        orderBy: { ordem: "desc" },
      });
      ordem = ultimaColuna ? ultimaColuna.ordem + 1000 : 1000;
    }

    return await prisma.colunaKanban.create({
      data: {
        titulo: data.titulo,
        ordem,
        quadroKanbanId: data.quadroKanbanId,
      },
    });
  }

  /**
   * Atualiza uma coluna Kanban
   */
  async atualizarColunaKanban(id: string, data: Partial<ColunaKanbanInput>) {
    return await prisma.colunaKanban.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta uma coluna Kanban
   */
  async deletarColunaKanban(id: string) {
    return await prisma.colunaKanban.delete({
      where: { id },
    });
  }

  /**
   * Cria um novo card Kanban
   */
  async criarCardKanban(data: CardKanbanInput, token: string | null) {
    // Se não fornecer ordem, busca a última ordem e adiciona 1000
    let ordem = data.ordem;
    if (ordem === undefined) {
      const ultimoCard = await prisma.cardKanban.findFirst({
        where: { colunaKanbanId: data.colunaKanbanId },
        orderBy: { ordem: "desc" },
      });
      ordem = ultimoCard ? ultimoCard.ordem + 1000 : 1000;
    }

    const usuarioSistemaId = await this.getUsuarioSistemaIdFromToken(token);
    return await prisma.cardKanban.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        ordem,
        colunaKanbanId: data.colunaKanbanId,
        usuarioSistemaId,
      },
      include: {
        usuarioSistema: {
          select: {
            id: true,
            email: true,
            funcionario: {
              include: {
                pessoa: {
                  select: {
                    nome: true,
                  },
                },
              },
            },
            cliente: {
              include: {
                empresa: {
                  select: {
                    razaoSocial: true,
                    nomeFantasia: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Move um card e calcula a nova ordem (Lógica de Ponto Médio)
   */
  async moverCard(data: MoverCardInput) {
    const { cardId, novaColunaId, ordemSuperior, ordemInferior, novaPosicao } =
      data;

    let novaOrdem: number;

    if (novaPosicao !== undefined) {
      // Se forneceu a posição, busca os cards da coluna e calcula a ordem
      const cards = await prisma.cardKanban.findMany({
        where: { colunaKanbanId: novaColunaId },
        orderBy: { ordem: "asc" },
      });

      if (cards.length === 0) {
        novaOrdem = 1000;
      } else if (novaPosicao === 0) {
        // Primeiro da lista
        novaOrdem = cards[0].ordem / 2;
      } else if (novaPosicao >= cards.length) {
        // Último da lista
        novaOrdem = cards[cards.length - 1].ordem + 1000;
      } else {
        // Entre dois cards
        const cardAnterior = cards[novaPosicao - 1];
        const cardPosterior = cards[novaPosicao];
        novaOrdem = (cardAnterior.ordem + cardPosterior.ordem) / 2;
      }
    } else if (ordemSuperior !== undefined && ordemInferior !== undefined) {
      // Usa a lógica de ponto médio
      novaOrdem = (ordemSuperior + ordemInferior) / 2;
    } else {
      // Se não forneceu nada, coloca no final
      const ultimoCard = await prisma.cardKanban.findFirst({
        where: { colunaKanbanId: novaColunaId },
        orderBy: { ordem: "desc" },
      });
      novaOrdem = ultimoCard ? ultimoCard.ordem + 1000 : 1000;
    }

    return await prisma.cardKanban.update({
      where: { id: cardId },
      data: {
        colunaKanbanId: novaColunaId,
        ordem: novaOrdem,
      },
    });
  }

  /**
   * Move uma coluna e calcula a nova ordem (Lógica de Ponto Médio)
   */
  async moverColuna(data: MoverColunaInput) {
    const { colunaId, novaPosicao } = data;

    // Buscar a coluna atual
    const colunaAtual = await prisma.colunaKanban.findUnique({
      where: { id: colunaId },
    });

    if (!colunaAtual) {
      throw new Error("Coluna não encontrada");
    }

    // Buscar todas as colunas do quadro ordenadas
    const colunas = await prisma.colunaKanban.findMany({
      where: { quadroKanbanId: colunaAtual.quadroKanbanId },
      orderBy: { ordem: "asc" },
    });

    // Remover a coluna atual da lista para calcular nova posição
    const colunasSemAtual = colunas.filter((c) => c.id !== colunaId);

    let novaOrdem: number;

    if (colunasSemAtual.length === 0) {
      // Única coluna, manter ordem atual
      novaOrdem = colunaAtual.ordem;
    } else if (novaPosicao === 0) {
      // Primeiro da lista
      novaOrdem = colunasSemAtual[0].ordem / 2;
    } else if (novaPosicao >= colunasSemAtual.length) {
      // Último da lista
      novaOrdem = colunasSemAtual[colunasSemAtual.length - 1].ordem + 1000;
    } else {
      // Entre duas colunas
      const colunaAnterior = colunasSemAtual[novaPosicao - 1];
      const colunaPosterior = colunasSemAtual[novaPosicao];
      novaOrdem = (colunaAnterior.ordem + colunaPosterior.ordem) / 2;
    }

    return await prisma.colunaKanban.update({
      where: { id: colunaId },
      data: {
        ordem: novaOrdem,
      },
    });
  }

  /**
   * Atualiza um card Kanban
   */
  async atualizarCardKanban(id: string, data: Partial<CardKanbanInput>) {
    return await prisma.cardKanban.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta um card Kanban
   */
  async deletarCardKanban(id: string) {
    return await prisma.cardKanban.delete({
      where: { id },
    });
  }

  /**
   * Vincula uma entidade ao card (Autocomplete @)
   */
  async vincularEntidadeAoCard(data: VincularEntidadeInput) {
    const { cardId, entidadeId, tipoEntidade } = data;

    // Valida se a entidade existe
    let entidadeExiste = false;
    switch (tipoEntidade) {
      case TipoEntidade.VAGA:
        entidadeExiste = !!(await prisma.vaga.findUnique({
          where: { id: entidadeId },
        }));
        break;
      case TipoEntidade.CANDIDATO:
        entidadeExiste = !!(await prisma.candidato.findUnique({
          where: { id: entidadeId },
        }));
        break;
      case TipoEntidade.CLIENTE:
        entidadeExiste = !!(await prisma.cliente.findUnique({
          where: { id: entidadeId },
        }));
        break;
      case TipoEntidade.COMPROMISSO:
        entidadeExiste = !!(await prisma.agenda.findUnique({
          where: { id: entidadeId },
        }));
        break;
    }

    if (!entidadeExiste) {
      throw new Error(
        `Entidade do tipo ${tipoEntidade} com ID ${entidadeId} não encontrada`
      );
    }

    // Cria o vínculo
    return await prisma.vinculoCard.create({
      data: {
        cardKanbanId: cardId,
        tipoEntidade: tipoEntidade,
        // Atribuição dinâmica baseada no Enum
        vagaId: tipoEntidade === TipoEntidade.VAGA ? entidadeId : null,
        candidatoId:
          tipoEntidade === TipoEntidade.CANDIDATO ? entidadeId : null,
        clienteId: tipoEntidade === TipoEntidade.CLIENTE ? entidadeId : null,
        compromissoId:
          tipoEntidade === TipoEntidade.COMPROMISSO ? entidadeId : null,
      },
    });
  }

  /**
   * Remove um vínculo de um card
   */
  async removerVinculo(vinculoId: string) {
    return await prisma.vinculoCard.delete({
      where: { id: vinculoId },
    });
  }

  /**
   * Lista os vínculos de um card
   */
  async listarVinculosDoCard(
    cardId: string
  ): Promise<VinculoCardWithRelations[]> {
    return await prisma.vinculoCard.findMany({
      where: { cardKanbanId: cardId },
      include: {
        vaga: {
          select: {
            id: true,
            titulo: true,
            status: true,
          },
        },
        candidato: {
          include: {
            pessoa: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
        cliente: {
          include: {
            empresa: {
              select: {
                id: true,
                razaoSocial: true,
                nomeFantasia: true,
              },
            },
          },
        },
        compromisso: {
          select: {
            id: true,
            titulo: true,
            dataHora: true,
          },
        },
      },
    });
  }

  /**
   * Busca entidades para autocomplete (usado no frontend para @)
   */
  async buscarEntidadesParaAutocomplete(
    tipo: TipoEntidade,
    search: string = "",
    limit: number = 10
  ) {
    switch (tipo) {
      case TipoEntidade.VAGA:
        return await prisma.vaga.findMany({
          where: {
            titulo: {
              contains: search,
              mode: "insensitive",
            },
          },
          take: limit,
          select: {
            id: true,
            titulo: true,
            status: true,
          },
        });
      case TipoEntidade.CANDIDATO:
        return await prisma.candidato.findMany({
          where: {
            pessoa: {
              nome: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          take: limit,
          include: {
            pessoa: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        });
      case TipoEntidade.CLIENTE:
        return await prisma.cliente.findMany({
          where: {
            empresa: {
              OR: [
                {
                  razaoSocial: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  nomeFantasia: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
          take: limit,
          include: {
            empresa: {
              select: {
                id: true,
                razaoSocial: true,
                nomeFantasia: true,
              },
            },
          },
        });
      case TipoEntidade.COMPROMISSO:
        return await prisma.agenda.findMany({
          where: {
            titulo: {
              contains: search,
              mode: "insensitive",
            },
          },
          take: limit,
          select: {
            id: true,
            titulo: true,
            dataHora: true,
          },
        });
      default:
        return [];
    }
  }

  /**
   * Cria um comentário em um card
   */
  async criarComentarioCard(data: ComentarioCardInput, token: string | null) {
    const usuarioSistemaId = await this.getUsuarioSistemaIdFromToken(token);

    return await prisma.comentarioCard.create({
      data: {
        cardKanbanId: data.cardKanbanId,
        conteudo: data.conteudo,
        usuarioSistemaId,
      },
      include: {
        usuarioSistema: {
          select: {
            id: true,
            email: true,
            funcionario: {
              include: {
                pessoa: {
                  select: {
                    nome: true,
                  },
                },
              },
            },
            cliente: {
              include: {
                empresa: {
                  select: {
                    razaoSocial: true,
                    nomeFantasia: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Lista comentários de um card
   */
  async listarComentariosDoCard(cardId: string) {
    return await prisma.comentarioCard.findMany({
      where: { cardKanbanId: cardId },
      orderBy: { criadoEm: "desc" },
      include: {
        usuarioSistema: {
          select: {
            id: true,
            email: true,
            funcionario: {
              include: {
                pessoa: {
                  select: {
                    nome: true,
                  },
                },
              },
            },
            cliente: {
              include: {
                empresa: {
                  select: {
                    razaoSocial: true,
                    nomeFantasia: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Atualiza um comentário
   */
  async atualizarComentarioCard(
    id: string,
    data: Partial<ComentarioCardInput>
  ) {
    return await prisma.comentarioCard.update({
      where: { id },
      data: {
        conteudo: data.conteudo,
      },
      include: {
        usuarioSistema: {
          select: {
            id: true,
            email: true,
            funcionario: {
              include: {
                pessoa: {
                  select: {
                    nome: true,
                  },
                },
              },
            },
            cliente: {
              include: {
                empresa: {
                  select: {
                    razaoSocial: true,
                    nomeFantasia: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Deleta um comentário
   */
  async deletarComentarioCard(id: string) {
    return await prisma.comentarioCard.delete({
      where: { id },
    });
  }
}
