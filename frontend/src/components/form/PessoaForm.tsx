import { useSafeForm } from '@/hook/useSafeForm';
import { PessoaInput } from '@/schemas/pessoa.schema';
import { makeName } from '@/utils/makeName';
import { FormProvider } from 'react-hook-form';
import { FormInput } from '../input/FormInput';
import ContatoForm from './ContatoForm';

type PessoaFormProps = {
  namePrefix?: string;
  onSubmit?: (data: PessoaInput) => void;
  contatoPessoa?: { title: string };
};

const PessoaForm = ({
  namePrefix = 'pessoa',
  onSubmit,
  contatoPessoa,
}: PessoaFormProps) => {
  const mode = 'context';
  const methods = useSafeForm({ mode, debug: true });
  const {
    register,
    control,
    formState: { errors },
  } = methods;

  const nome = makeName<PessoaInput>(namePrefix, 'nome');
  const cpf = makeName<PessoaInput>(namePrefix, 'cpf');
  const rg = makeName<PessoaInput>(namePrefix, 'rg');
  const dataNascimento = makeName<PessoaInput>(namePrefix, 'dataNascimento');

  const formContent = (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <FormInput name={nome} label="Nome Completo" />

      <FormInput
        name={cpf}
        maskProps={{ mask: '000.000.000-00' }}
        label="CPF"
        placeholder="000.000.000-00"
      />

      <FormInput
        name={dataNascimento}
        label="Data de Nascimento"
        placeholder="DD/MM/AAAA"
        maskProps={{ mask: '00/00/0000' }}
      />

      <FormInput
        name={rg}
        register={register}
        label="RG"
        placeholder="00000-000"
        errors={errors}
      />

      {contatoPessoa && (
        <div className="col-span-full" title={contatoPessoa.title}>
          <h3 className="text-xl font-bold">{contatoPessoa.title}</h3>
          <section className="flex w-full gap-2">
            <ContatoForm namePrefix={`${namePrefix}.contatos[0]`} />
          </section>
        </div>
      )}
    </section>
  );

  if (mode !== 'context') {
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data: any) => onSubmit?.(data))}>
          {formContent}
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors"
          >
            Salvar Pessoa
          </button>
        </form>
      </FormProvider>
    );
  }

  return formContent;
};

export default PessoaForm;
