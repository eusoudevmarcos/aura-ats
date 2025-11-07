import { PessoaInput } from '@/schemas/pessoa.schema';
import { makeName } from '@/utils/makeName';
import { FormInput } from '../input/FormInput';

type PessoaFormProps = {
  namePrefix?: string;
  onSubmit?: (data: PessoaInput) => void;
};

const PessoaForm = ({ namePrefix = 'pessoa' }: PessoaFormProps) => {
  const nome = makeName<PessoaInput>(namePrefix, 'nome');
  const cpf = makeName<PessoaInput>(namePrefix, 'cpf');
  const rg = makeName<PessoaInput>(namePrefix, 'rg');
  const dataNascimento = makeName<PessoaInput>(namePrefix, 'dataNascimento');

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <FormInput
        name={cpf}
        maskProps={{ mask: '000.000.000-00' }}
        label="CPF"
        placeholder="000.000.000-00"
      />

      <FormInput name={nome} label="Nome Completo" />

      <FormInput
        name={dataNascimento}
        label="Data de Nascimento"
        inputProps={{ type: 'text', placeholder: '00/00/0000' }}
        maskProps={{ mask: '00/00/0000' }}
      />

      {/* <FormInput name={rg} label="RG" placeholder="00000-000" /> */}

      <FormInput
        name={rg}
        maskProps={{ mask: '0000000000' }}
        label="RG"
        placeholder="000000000"
      />

      {/* {contatoPessoa && (
        <div className="col-span-full" title={contatoPessoa.title}>
          <h3 className="text-xl font-bold">{contatoPessoa.title}</h3>
          <section className="flex w-full gap-2">
            <ContatoForm namePrefix={`${namePrefix}.contatos[0]`} />
          </section>
        </div>
      )} */}
    </section>
  );
};

export default PessoaForm;
