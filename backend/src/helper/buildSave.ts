import {
  BuildResult,
  BuildSaveOptions,
  RelationConfig,
  SaveOptions,
  ValidationConfig,
} from "../types/buildSave";

/**
 * Converte o nome do campo para o nome correto do modelo no Prisma
 */
function getModelName(fieldName: string): string {
  const modelMap: Record<string, string> = {
    beneficios: "beneficio",
    habilidades: "habilidade",
    anexos: "anexo",
    localizacao: "localizacao",
  };

  return modelMap[fieldName] || fieldName;
}

/**
 * Valida se um registro existe baseado na configuração de validação
 */
async function validateExistingRecord(
  tx: any,
  model: string,
  data: any,
  validation: ValidationConfig
): Promise<any> {
  if (!validation || !tx || !tx[model]) {
    throw new Error(`Modelo '${model}' não encontrado na transação`);
  }

  const where: Record<string, any> = {};

  // Usa campos únicos para busca
  if (validation.uniqueKeys && validation.uniqueKeys.length > 0) {
    for (const key of validation.uniqueKeys) {
      if (data[key] !== undefined) {
        where[key] = data[key];
      }
    }
  }

  // Usa campos específicos de busca
  if (validation.searchFields) {
    Object.assign(where, validation.searchFields);
  }

  // Se não há condições de busca, retorna null
  if (Object.keys(where).length === 0) {
    return null;
  }

  try {
    return await tx[model].findFirst({ where });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Erro ao buscar registro em '${model}': ${errorMessage}`);
  }
}

/**
 * Processa uma relação one-to-one (como Vaga → Localizacao)
 */
async function processOneToOne(
  tx: any,
  value: any,
  relationConfig: RelationConfig,
  fieldName: string
): Promise<any> {
  if (!value) return undefined;

  try {
    // Se é apenas para conectar
    if (relationConfig.connectOnly) {
      return { connect: value };
    }

    // Se tem ID, conecta
    if (value.id) {
      return { connect: { id: value.id } };
    }

    // Valida se existe
    const existing = relationConfig.validation
      ? await validateExistingRecord(
          tx,
          getModelName(fieldName),
          value,
          relationConfig.validation
        )
      : null;

    if (existing) {
      // Para one-to-one, se existe, conecta
      return { connect: { id: existing.id } };
    }

    return { create: value };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Erro ao processar relação one-to-one '${fieldName}': ${errorMessage}`
    );
  }
}

/**
 * Processa uma relação one-to-many (como Vaga → Beneficio)
 */
async function processOneToMany(
  tx: any,
  value: any[],
  relationConfig: RelationConfig,
  fieldName: string
): Promise<any> {
  if (!Array.isArray(value)) {
    throw new Error(
      `Campo '${fieldName}' deve ser um array para relação one-to-many`
    );
  }

  try {
    const result: any = {};

    // Se é apenas para conectar
    if (relationConfig.connectOnly) {
      result.connect = value.map((item) => ({ id: item.id }));
      return result;
    }

    // Processa cada item
    const creates: any[] = [];
    const connects: any[] = [];

    for (const item of value) {
      // Se tem ID, conecta
      if (item.id) {
        connects.push({ id: item.id });
        continue;
      }

      // Valida se existe
      const existing = relationConfig.validation
        ? await validateExistingRecord(
            tx,
            getModelName(fieldName),
            item,
            relationConfig.validation
          )
        : null;

      if (existing) {
        // Se existe, conecta
        connects.push({ id: existing.id });
      } else {
        creates.push(item);
      }
    }

    // Monta o resultado
    if (creates.length > 0) result.create = creates;
    if (connects.length > 0) result.connect = connects;

    return Object.keys(result).length > 0 ? result : undefined;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Erro ao processar relação one-to-many '${fieldName}': ${errorMessage}`
    );
  }
}

/**
 * Processa uma relação many-to-many (como Vaga → Habilidade via VagaHabilidade)
 */
async function processManyToMany(
  tx: any,
  value: any[],
  relationConfig: RelationConfig,
  fieldName: string
): Promise<any> {
  if (!Array.isArray(value)) {
    throw new Error(
      `Campo '${fieldName}' deve ser um array para relação many-to-many`
    );
  }

  try {
    // Para many-to-many com tabelas de junção explícitas, não podemos usar connect/create
    // Precisamos processar isso após a criação da vaga
    const result: any = {};

    // Processa cada item para validar se existe
    const connects: any[] = [];
    const creates: any[] = [];

    for (const item of value) {
      if (item.id) {
        connects.push({ id: item.id });
      } else {
        // Valida se existe
        const existing = relationConfig.validation
          ? await validateExistingRecord(
              tx,
              getModelName(fieldName),
              item,
              relationConfig.validation
            )
          : null;

        if (existing) {
          connects.push({ id: existing.id });
        } else {
          creates.push(item);
        }
      }
    }

    // Para many-to-many, retornamos os dados para processamento posterior
    if (creates.length > 0) result.create = creates;
    if (connects.length > 0) result.connect = connects;

    return Object.keys(result).length > 0 ? result : undefined;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Erro ao processar relação many-to-many '${fieldName}': ${errorMessage}`
    );
  }
}

/**
 * Processa relações many-to-many após a criação da vaga
 */
async function processManyToManyRelations(
  tx: any,
  vagaId: string,
  value: any[],
  relationConfig: RelationConfig,
  fieldName: string
): Promise<void> {
  try {
    // Primeiro, remove todas as relações existentes
    if (fieldName === "habilidades") {
      await tx.vagaHabilidade.deleteMany({
        where: { vagaId },
      });
    } else if (fieldName === "anexos") {
      await tx.vagaAnexo.deleteMany({
        where: { vagaId },
      });
    }

    // Processa cada item
    for (const item of value) {
      let itemId: string;

      if (item.id) {
        itemId = item.id;
      } else {
        // Valida se existe
        const existing = relationConfig.validation
          ? await validateExistingRecord(
              tx,
              getModelName(fieldName),
              item,
              relationConfig.validation
            )
          : null;

        if (existing) {
          itemId = existing.id;
        } else {
          // Cria o item se não existir
          const created = await tx[getModelName(fieldName)].create({
            data: item,
          });
          itemId = created.id;
        }
      }

      // Cria a relação na tabela de junção
      if (fieldName === "habilidades") {
        await tx.vagaHabilidade.create({
          data: {
            vagaId,
            habilidadeId: itemId,
            nivelExigido: item.nivelExigido,
          },
        });
      } else if (fieldName === "anexos") {
        await tx.vagaAnexo.create({
          data: {
            vagaId,
            anexoId: itemId,
          },
        });
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Erro ao processar relações many-to-many '${fieldName}': ${errorMessage}`
    );
  }
}

/**
 * Constrói os dados para o Prisma baseado na configuração de relações
 */
async function buildPrismaData<T extends Record<string, any>>(
  options: BuildSaveOptions<T>
): Promise<BuildResult> {
  const { data, relations = {}, tx, include = {} } = options;

  const result: Record<string, any> = {};
  const includes: Record<string, any> = { ...include };

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;

    const relationConfig = relations[key];

    if (relationConfig) {
      try {
        // Processa relação
        let processedValue: any;

        switch (relationConfig.type) {
          case "one-to-one":
            processedValue = await processOneToOne(
              tx,
              value,
              relationConfig,
              key
            );
            break;
          case "one-to-many":
            processedValue = await processOneToMany(
              tx,
              value,
              relationConfig,
              key
            );
            break;
          case "many-to-many":
            processedValue = await processManyToMany(
              tx,
              value,
              relationConfig,
              key
            );
            break;
          default:
            throw new Error(
              `Tipo de relação '${relationConfig.type}' não suportado para campo '${key}'`
            );
        }

        if (processedValue !== undefined) {
          result[key] = processedValue;

          // Adiciona include se configurado
          if (relationConfig.include) {
            includes[key] = relationConfig.include;
          } else {
            includes[key] = true;
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new Error(`Erro ao processar relação '${key}': ${errorMessage}`);
      }
    } else {
      // Campo primitivo
      result[key] = value;
    }
  }

  return { data: result, includes };
}

/**
 * Função principal para salvar dados com suporte completo a relações
 */
export async function save<T extends Record<string, any>>(
  options: SaveOptions<T>
) {
  const {
    prisma,
    tx,
    model,
    data,
    idField,
    returnIncludes = true,
    relations = {},
  } = options;

  try {
    const id = idField ? (data as any)[idField] : undefined;

    // Separa dados many-to-many dos outros dados
    const manyToManyData: Record<string, any> = {};
    const otherData: Record<string, any> = { ...data };

    // Remove dados many-to-many do objeto principal
    for (const [key, relationConfig] of Object.entries(relations)) {
      if (relationConfig.type === "many-to-many" && data[key]) {
        manyToManyData[key] = data[key];
        delete otherData[key];
      }
    }

    // Constrói os dados para o Prisma (sem many-to-many)
    const { data: prismaData, includes } = await buildPrismaData({
      ...options,
      data: otherData,
    });

    let result: any;

    // Decide create ou update
    if (id) {
      result = await (tx as any)[model].update({
        where: { [idField!]: id },
        data: prismaData,
        include: returnIncludes ? includes : undefined,
      });
    } else {
      result = await (tx as any)[model].create({
        data: prismaData,
        include: returnIncludes ? includes : undefined,
      });
    }

    // Processa relações many-to-many após a criação/atualização
    const vagaId = result.id;

    for (const [fieldName, value] of Object.entries(manyToManyData)) {
      const relationConfig = relations[fieldName];
      if (relationConfig && relationConfig.type === "many-to-many") {
        await processManyToManyRelations(
          tx,
          vagaId,
          value,
          relationConfig,
          fieldName
        );
      }
    }

    // Retorna o resultado com includes atualizados
    if (returnIncludes) {
      return await (tx as any)[model].findUnique({
        where: { id: vagaId },
        include: includes,
      });
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Erro ao salvar no modelo '${String(model)}': ${errorMessage}`
    );
  }
}

/**
 * Função para construir dados sem salvar (útil para validação ou debug)
 */
export async function buildSaveData<T extends Record<string, any>>(
  options: BuildSaveOptions<T>
): Promise<BuildResult> {
  return await buildPrismaData(options);
}
