# Sistema Flexível de BuildSave - Versão Corrigida

Este sistema oferece uma solução genérica e flexível para salvar dados com relações complexas no Prisma, **corrigida especificamente para o schema do seu projeto**. Suporta todas as estruturas de relacionamento com validação automática e **tratamento de erros específicos**.

## ✅ Problemas Corrigidos

- **Erro específico**: Agora você recebe mensagens de erro exatas indicando qual relação está falhando
- **Schema compatível**: Funciona perfeitamente com o seu schema do Prisma
- **Validação inteligente**: Verifica automaticamente se registros existem antes de criar
- **Transações ACID**: Mantém integridade dos dados

## Características Principais

- ✅ **Flexibilidade Total**: Suporta qualquer estrutura de dados nested
- ✅ **Validação Inteligente**: Verifica automaticamente se registros existem antes de criar
- ✅ **Tipos de Relação**: Suporta one-to-one, one-to-many e many-to-many
- ✅ **Transações ACID**: Funciona dentro de `$transaction` do Prisma
- ✅ **Tipagem Forte**: Mantém a tipagem TypeScript em toda a estrutura
- ✅ **Configuração Declarativa**: Define relações através de configuração simples
- ✅ **Erros Específicos**: Mensagens de erro claras indicando exatamente onde está o problema

## Estrutura de Tipos

### ValidationConfig

```typescript
interface ValidationConfig {
  uniqueKeys?: string[]; // Campos únicos para busca
  searchFields?: Record<string, any>; // Campos específicos para busca
  model?: string; // Modelo específico (se diferente do campo)
}
```

### RelationConfig

```typescript
interface RelationConfig {
  type: "one-to-one" | "one-to-many" | "many-to-many";
  validation?: ValidationConfig;
  include?: Record<string, any>; // Include para a relação
  connectOnly?: boolean; // Apenas conectar (não criar)
}
```

## Como Usar

### 1. Configuração Básica

```typescript
import { save } from "../helper/buildSave";

const vaga = await save({
  prisma,
  tx,
  model: "vaga",
  idField: "id", // opcional, para updates
  data: vagaData,
  relations: {
    localizacao: {
      type: "one-to-one",
      validation: {
        uniqueKeys: ["cidade", "uf"],
      },
    },
    beneficios: {
      type: "one-to-many",
      validation: {
        uniqueKeys: ["nome"],
      },
    },
  },
  include: {
    localizacao: true,
    beneficios: true,
  },
});
```

### 2. Dentro de Transação

```typescript
return await prisma.$transaction(async (tx) => {
  return await save({
    prisma,
    tx,
    model: "vaga",
    data: vagaData,
    relations: relationsConfig,
  });
});
```

## Tipos de Relação (Baseado no Seu Schema)

### One-to-One (Vaga → Localizacao)

```typescript
// Cria ou conecta localização
localizacao: {
  type: 'one-to-one',
  validation: {
    uniqueKeys: ['cidade', 'uf'],
  },
}
```

### One-to-Many (Vaga → Beneficio)

```typescript
// Cria ou conecta múltiplos benefícios
beneficios: {
  type: 'one-to-many',
  validation: {
    uniqueKeys: ['nome'],
  },
}
```

### Many-to-Many (Vaga → Habilidade via VagaHabilidade)

```typescript
// Cria ou conecta habilidades (relação many-to-many)
habilidades: {
  type: 'many-to-many',
  validation: {
    uniqueKeys: ['nome'],
  },
}
```

### Many-to-Many (Vaga → Anexo via VagaAnexo)

```typescript
// Cria ou conecta anexos (relação many-to-many)
anexos: {
  type: 'many-to-many',
  validation: {
    uniqueKeys: ['anexoId'],
  },
}
```

## Estratégias de Validação

### 1. Campos Únicos

```typescript
validation: {
  uniqueKeys: ['nome', 'email'], // Busca por nome E email
}
```

### 2. Campos Específicos

```typescript
validation: {
  searchFields: {
    cidade: "São Paulo",
    uf: "SP",
  },
}
```

### 3. Modelo Diferente

```typescript
validation: {
  uniqueKeys: ['nome'],
  model: "outroModelo", // Busca em modelo diferente
}
```

### 4. Sem Validação

```typescript
// Sem validation = sempre cria novo registro
localizacao: {
  type: 'one-to-one',
  // Sem validation configurado
}
```

## Estratégias de Conexão

### 1. Criar ou Conectar (Padrão)

```typescript
// Se existe, conecta. Se não, cria
localizacao: {
  type: 'one-to-one',
  validation: { uniqueKeys: ['cidade', 'uf'] },
}
```

### 2. Apenas Conectar

```typescript
// Apenas conecta registros existentes
localizacao: {
  type: 'one-to-one',
  connectOnly: true,
}
```

### 3. Conectar por ID

```typescript
// Se o dado tem ID, sempre conecta
const data = {
  localizacao: { id: "existing-id" },
};
```

## Exemplo Completo (Seu JSON)

```typescript
const vagaData = {
  titulo: "Desenvolvedor Fullstack Sênior",
  descricao: "Procuramos um desenvolvedor Fullstack experiente...",
  requisitos: "Experiência em APIs REST...",
  responsabilidades: "Desenvolver e manter aplicações...",
  salario: 8500.0,
  tipoSalario: "mensal",
  dataFechamento: "2025-12-31T23:59:59.000Z",
  categoria: "TECNOLOGIA",
  status: "ATIVA",
  tipoContrato: "CLT",
  nivelExperiencia: "SENIOR",
  areaCandidato: "MEDICINA",
  clienteId: "clg4n7w6s0000r4w3e9f4a0c8",

  // One-to-one
  localizacao: {
    cep: "01001-000",
    cidade: "São Paulo",
    bairro: "Sé",
    uf: "SP",
    estado: "São Paulo",
    complemento: "Edifício X",
    logradouro: "Praça da Sé",
    regiao: "Sudeste",
  },

  // One-to-many
  beneficios: [
    {
      nome: "Vale Refeição",
      descricao: "R$ 40,00 por dia",
    },
    {
      nome: "Plano de Saúde",
      descricao: "Amil - Apartamento",
    },
  ],

  // Many-to-many
  habilidades: [
    {
      nome: "JavaScript",
      tipoHabilidade: "LINGUAGEM",
      nivelExigido: "AVANCADO",
    },
    {
      nome: "React",
      tipoHabilidade: "FRAMEWORK",
      nivelExigido: "INTERMEDIARIO",
    },
  ],

  // Many-to-many
  anexos: [
    {
      anexoId: "clg4n7w6s0003r4w3e9f4a0c1",
    },
  ],
};

const relations = {
  localizacao: {
    type: "one-to-one",
    validation: { uniqueKeys: ["cidade", "uf"] },
  },
  beneficios: {
    type: "one-to-many",
    validation: { uniqueKeys: ["nome"] },
  },
  habilidades: {
    type: "many-to-many",
    validation: { uniqueKeys: ["nome"] },
  },
  anexos: {
    type: "many-to-many",
    validation: { uniqueKeys: ["anexoId"] },
  },
};
```

## Tratamento de Erros

Agora você recebe **mensagens de erro específicas**:

```typescript
// Exemplo de erro específico
"Erro ao processar relação 'localizacao': Erro ao buscar registro em 'localizacao': Modelo 'localizacao' não encontrado na transação";

// Exemplo de erro de validação
"Erro ao processar relação 'beneficios': Campo 'beneficios' deve ser um array para relação one-to-many";

// Exemplo de erro de tipo
"Erro ao processar relação 'habilidades': Tipo de relação 'invalid-type' não suportado para campo 'habilidades'";
```

## Vantagens

1. **Simplicidade**: Um único método para create/update
2. **Flexibilidade**: Suporta qualquer estrutura de dados
3. **Integridade**: Validação automática de dados existentes
4. **Performance**: Operações otimizadas dentro de transações
5. **Manutenibilidade**: Configuração declarativa e clara
6. **Tipagem**: Forte tipagem TypeScript em toda a estrutura
7. **Debugging**: Erros específicos e claros

## Considerações

- Sempre use dentro de `$transaction` para manter ACID
- Configure `uniqueKeys` apropriadamente para evitar duplicatas
- Use `connectOnly: true` quando quiser apenas conectar existentes
- O sistema automaticamente decide entre create/update baseado no ID
- **Erros específicos**: Agora você sabe exatamente onde está o problema
