import ContatoForm from '@/components/form/ContatoForm';
import LocalizacaoForm from '@/components/form/LocalizacaoForm';
import { EmpresaInput } from '@/schemas/empresa.schema';
import { makeName } from '@/utils/makeName';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { FormInput } from '../input/FormInput';
import PessoaForm from './PessoaForm';

type EmpresaFormProps<T extends FieldValues> = {
  namePrefix?: string;
  formContexto?: UseFormReturn<T>;
  onSubmit?: (data: any) => void;
  include?: { localizacao?: boolean; contatos?: boolean };
};

const EmpresaForm = ({
  namePrefix = 'empresa',
  include,
}: EmpresaFormProps<any>) => {
  const cnpj = makeName<EmpresaInput>(namePrefix, 'cnpj');
  const razaoSocial = makeName<EmpresaInput>(namePrefix, 'razaoSocial');
  const nomeFantasia = makeName<EmpresaInput>(namePrefix, 'nomeFantasia');
  const dataAbertura = makeName<EmpresaInput>(namePrefix, 'dataAbertura');

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-2">
      <FormInput
        name={cnpj}
        maskProps={{ mask: '00.000.000/0000-00' }}
        label="CNPJ"
        placeholder="00.000.000/0000-00"
        inputProps={{ classNameContainer: 'col-span-2' }}
      />

      <FormInput
        name={dataAbertura}
        label="Data abertura"
        inputProps={{
          type: 'text',
          placeholder: '00/00/0000',
          classNameContainer: 'col-span-2',
        }}
        maskProps={{ mask: '00/00/0000' }}
      />

      <FormInput
        name={razaoSocial}
        label="Razão Social"
        placeholder="Ex: Aura ATS .LTDA"
        inputProps={{ classNameContainer: 'col-span-2' }}
      />

      <FormInput
        name={nomeFantasia}
        label="Nome Fantasia"
        placeholder="Ex: Aura ATS .LTDA"
        inputProps={{ classNameContainer: 'col-span-2' }}
      />

      <div className="col-span-full flex flex-col gap-2">
        {include?.contatos && (
          <div title="contato da empresa">
            <h3 className="text-md font-bold">Contato da empresa</h3>
            <section className="flex w-full gap-2">
              <ContatoForm namePrefix={`${namePrefix}.contatos[0]`} />
            </section>
          </div>
        )}

        {include?.localizacao && (
          <div title="Localizacao">
            <h3 className="text-md font-bold">Localização da empresa</h3>
            <LocalizacaoForm namePrefix={`${namePrefix}.localizacoes[0]`} />
          </div>
        )}

        <div title="Representante">
          <h3 className="text-md font-bold">Representante</h3>
          <PessoaForm namePrefix={`${namePrefix}.representantes[0]`} />
        </div>
      </div>
    </section>
  );
};

export default EmpresaForm;
