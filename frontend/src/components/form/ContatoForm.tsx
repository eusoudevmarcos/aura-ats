import { useSafeForm } from '@/hook/useSafeForm';
import { ContatoInput, contatoSchema } from '@/schemas/contato.schema';
import { makeName } from '@/utils/makeName';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';
import { FormInput } from '../input/FormInput';

// ================================
// TYPES OTIMIZADOS
// ================================

type FormMode = 'context' | 'independent';

type ContatoFormProps = {
  namePrefix?: string;
  formContexto?: UseFormReturn<ContatoInput> & { mode: string }; // Tipagem melhorada
  onSubmit?: (data: ContatoInput) => void; // Tipagem específica
};

type ContatoFormInnerProps = {
  namePrefix: string;
  methods: UseFormReturn<ContatoInput>; // Tipagem específica
};

// ================================
// useSafeForm OTIMIZADO
// ================================

type UseSafeFormReturn<T extends FieldValues> = UseFormReturn<T> & {
  mode: FormMode;
  isContext: boolean;
  isIndependent: boolean;
};

function useOptimizedSafeForm<T extends Record<string, any>>({
  useFormProps,
  debug = false,
  mode = 'context' as FormMode,
}: {
  mode?: FormMode;
  debug?: boolean;
  useFormProps?: Parameters<typeof useSafeForm<T>>[0]['useFormProps'];
}): UseSafeFormReturn<T> {
  const result = useSafeForm<T>({
    useFormProps,
    debug,
    mode,
  });

  // Detecta o modo atual baseado na disponibilidade do contexto
  const actualMode: FormMode = 'mode' in result ? result.mode : mode;

  return {
    ...result,
    mode: actualMode,
    isContext: actualMode === 'context',
    isIndependent: actualMode === 'independent',
  } as UseSafeFormReturn<T>;
}

// ================================
// COMPONENTE INNER OTIMIZADO
// ================================

export function ContatoFormInner({
  namePrefix,
  methods,
}: ContatoFormInnerProps) {
  const {
    control,
    formState: { errors },
  } = methods;

  // Memoização dos nomes dos campos (evita recálculo desnecessário)
  const fieldNames = {
    telefone: makeName<ContatoInput>(namePrefix, 'telefone'),
    whatsapp: makeName<ContatoInput>(namePrefix, 'whatsapp'),
    email: makeName<ContatoInput>(namePrefix, 'email'),
  } as const;

  return (
    <>
      <FormInput
        name={fieldNames.telefone}
        control={control}
        maskProps={{ mask: '(00) 0000-0000' }}
        label="Telefone"
        placeholder="(00) 0000-0000"
        errors={errors}
      />

      <FormInput
        name={fieldNames.whatsapp}
        control={control}
        maskProps={{ mask: '(00) 00000-0000' }}
        label="Celular/WhatsApp"
        placeholder="(00) 00000-0000"
        errors={errors}
      />

      <FormInput
        name={fieldNames.email}
        control={control}
        label="E-mail"
        placeholder="comercialaura@gmail.com"
        type="email"
        errors={errors}
      />
    </>
  );
}

// ================================
// COMPONENTE PRINCIPAL OTIMIZADO
// ================================

export function ContatoForm({
  namePrefix = 'contatos[0]',
  formContexto,
  onSubmit,
}: ContatoFormProps) {
  // Se formContexto for passado, usa ele diretamente (modo context explícito)
  const methods =
    formContexto ??
    useOptimizedSafeForm<ContatoInput>({
      useFormProps: {
        resolver: zodResolver(contatoSchema),
      },
      mode: formContexto ? 'context' : 'independent',
    });

  // Determina o modo atual
  const currentMode = formContexto ? 'context' : methods.mode;
  const isIndependent = currentMode === 'independent';

  // Render condicional otimizado
  const formContent = (
    <ContatoFormInner namePrefix={namePrefix} methods={methods} />
  );

  // Se é independente, precisa do FormProvider e form
  if (isIndependent) {
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit!)}>
          {formContent}

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            disabled={methods.formState.isSubmitting}
          >
            {methods.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </FormProvider>
    );
  }

  // Se é contexto, apenas renderiza os campos
  return formContent;
}

// ================================
// HOOKS UTILITÁRIOS SIMPLES
// ================================

/**
 * Hook para usar o ContatoForm de forma tipada
 * Detecta automaticamente se está em contexto ou independente
 */
export function useContatoFormMethods() {
  return useOptimizedSafeForm<ContatoInput>({
    useFormProps: {
      resolver: zodResolver(contatoSchema),
    },
  });
}

/**
 * Wrapper tipado para criar o form independente
 */
export function createContatoForm(
  props?: Omit<ContatoFormProps, 'formContexto'>
) {
  return <ContatoForm {...props} />;
}

/**
 * Wrapper tipado para usar com contexto externo
 */
export function createContatoFormWithContext(
  methods: UseFormReturn<any> & { mode: string },
  props?: Omit<ContatoFormProps, 'formContexto'>
) {
  return <ContatoForm {...props} formContexto={methods} />;
}

// ================================
// UTILITÁRIOS DE CONFIGURAÇÃO
// ================================

/**
 * Configuração padrão para formulário independente
 */
export const independentFormConfig = {
  mode: 'independent' as const,
  showSubmitButton: true,
};

/**
 * Configuração padrão para contexto
 */
export const contextFormConfig = {
  mode: 'context' as const,
  showSubmitButton: false,
};

// ================================
// EXEMPLOS DE USO (COMENTADOS)
// ================================

/*
// EXEMPLO 1: Uso independente (mais simples)
function ExemploIndependente() {
  return (
    <ContatoForm
      namePrefix="contato"
      onSubmit={(data) => {
        console.log('Dados do contato:', data);
        // API call aqui
      }}
    />
  );
}

// EXEMPLO 2: Uso com contexto externo
function ExemploComContexto() {
  const methods = useForm<{ empresa: { contatos: ContatoInput[] } }>();
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>
        <div>
          <h2>Dados da Empresa</h2>
          
          <ContatoForm
            namePrefix="empresa.contatos[0]"
            formContexto={methods}
          />
        </div>
        
        <button type="submit">Salvar Empresa</button>
      </form>
    </FormProvider>
  );
}

// EXEMPLO 3: Múltiplos contatos
function ExemploMultiplosContatos() {
  const methods = useForm();
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>
        {[0, 1, 2].map(index => (
          <div key={index}>
            <h3>Contato {index + 1}</h3>
            <ContatoForm
              namePrefix={`contatos[${index}]`}
              formContexto={methods}
            />
          </div>
        ))}
        
        <button type="submit">Salvar Todos</button>
      </form>
    </FormProvider>
  );
}

// EXEMPLO 4: Com hook personalizado
function ExemploComHook() {
  const methods = useContatoFormMethods();
  
  return (
    <div>
      <ContatoForm
        formContexto={methods}
        namePrefix="contato"
      />
      
      <button 
        onClick={() => methods.reset()}
        className="mt-2 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Limpar Formulário
      </button>
    </div>
  );
}
*/

export default ContatoForm;
