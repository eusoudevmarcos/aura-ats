import { PessoaInput } from '@/schemas/pessoa.schema';
import { makeName } from '@/utils/makeName';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormInput } from '../input/FormInput';

type PessoaFormProps = {
  namePrefix?: string;
  isYear?: boolean;
  onSubmit?: (data: PessoaInput) => void;
};

function calcularIdadePorDataNascimento(
  dataNascimento: string | Date | undefined
): number | null {
  if (!dataNascimento) return null;

  let nascimento: Date;

  if (typeof dataNascimento === 'string') {
    // Formato DD/MM/AAAA esperado
    const partes = dataNascimento.split('/');
    if (partes.length !== 3) return null;
    const [dia, mes, ano] = partes;
    nascimento = new Date(Number(ano), Number(mes) - 1, Number(dia));
    if (isNaN(nascimento.getTime())) return null;
  } else if (dataNascimento instanceof Date) {
    nascimento = dataNascimento;
  } else {
    return null;
  }

  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade >= 0 ? idade : null;
}

const PessoaForm = ({
  namePrefix = 'pessoa',
  isYear = false,
}: PessoaFormProps) => {
  const nome = makeName<PessoaInput>(namePrefix, 'nome');
  const cpf = makeName<PessoaInput>(namePrefix, 'cpf');
  const rg = makeName<PessoaInput>(namePrefix, 'rg');
  const dataNascimento = makeName<PessoaInput>(namePrefix, 'dataNascimento');

  const { control } = useFormContext();
  const dataNascimentoValue = useWatch({ control, name: dataNascimento });

  const idade = calcularIdadePorDataNascimento(dataNascimentoValue);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <FormInput
        name={cpf}
        maskProps={{ mask: '000.000.000-00' }}
        label="CPF"
        placeholder="000.000.000-00"
      />

      <FormInput name={nome} label="Nome Completo" />

      <div className="flex flex-col gap-2">
        <FormInput
          name={dataNascimento}
          label="Data de Nascimento"
          inputProps={{ type: 'text', placeholder: '00/00/0000' }}
          maskProps={{ mask: '00/00/0000' }}
        />

        {isYear && idade !== null && !isNaN(idade) && (
          <span className="text-gray-600 text-sm">Idade: {idade} anos</span>
        )}
      </div>

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
