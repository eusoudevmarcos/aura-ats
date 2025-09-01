import ContatoForm from '@/components/form/ContatoForm';
import LocalizacaoForm from '@/components/form/LocalizacaoForm';
import { useSafeForm } from '@/hook/useSafeForm';
import { EmpresaInput, empresaSchema } from '@/schemas/empresa.schema';
import { makeName } from '@/utils/makeName';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';
import { FormInput } from '../input/FormInput';
import PessoaForm from './PessoaForm';

type EmpresaFormProps<T extends FieldValues> = {
  namePrefix?: string;
  formContexto?: UseFormReturn<T>;
  onSubmit?: (data: any) => void;
};

const EmpresaForm = ({
  namePrefix = 'empresa',
  onSubmit,
}: EmpresaFormProps<any>) => {
  const mode = 'context';

  const methods = useSafeForm({
    debug: true,
    useFormProps: { resolver: zodResolver(empresaSchema) },
    mode,
  });

  const {
    register,
    control,
    formState: { errors },
  } = methods;

  const cnpj = makeName<EmpresaInput>(namePrefix, 'cnpj');
  const razaoSocial = makeName<EmpresaInput>(namePrefix, 'razaoSocial');
  const dataAbertura = makeName<EmpresaInput>(namePrefix, 'dataAbertura');

  const submitHandler = (data: any) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const formContent = (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <FormInput
        name={cnpj}
        control={control}
        maskProps={{ mask: '00.000.000/0000-00' }}
        label="CNPJ"
        placeholder="00.000.000/0000-00"
        errors={errors}
      />

      <FormInput
        name={razaoSocial}
        register={register}
        label="Razão Social"
        placeholder="Ex: Aura ATS .LTDA"
        errors={errors}
      />

      <FormInput
        name={dataAbertura}
        control={control}
        label="Data abertura"
        placeholder="00/00/0000"
        errors={errors}
        type="date"
      />

      <div className="col-span-full flex flex-col gap-2">
        <div title="contato da empresa">
          <h3 className="text-md font-bold">Contato da empresa</h3>
          <section className="flex w-full gap-2">
            <ContatoForm namePrefix={`${namePrefix}.contatos[0]`} />
          </section>
        </div>
        <div title="Localizacao">
          <h3 className="text-md font-bold">Localização da empresa</h3>
          <LocalizacaoForm namePrefix={`${namePrefix}.localizacoes[0]`} />
        </div>

        <div title="Representante">
          <h3 className="text-md font-bold">Representante</h3>
          <PessoaForm
            namePrefix={`${namePrefix}.representantes[0]`}
            contatoPessoa={{ title: 'Contato Representante' }}
          />
        </div>
      </div>
    </section>
  );

  if (mode !== 'context') {
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submitHandler)}>
          {formContent}
          <button type="submit">Salvar Empresa</button>
        </form>
      </FormProvider>
    );
  }

  return formContent;
};

export default EmpresaForm;
