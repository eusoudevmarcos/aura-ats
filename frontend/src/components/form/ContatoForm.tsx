import { useSafeForm } from '@/hook/useSafeForm';
import { ContatoInput, contatoSchema } from '@/schemas/contato.schema';
import { makeName } from '@/utils/makeName';
import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormReturn } from 'react-hook-form';
import { FormInput } from '../input/FormInput';

type ContatoFormProps = {
  namePrefix: string; // ex: "empresa.contatos[0]"
  formContexto?: UseFormReturn;
  onSubmit?: (data: any) => void;
};

function ContatoFormInner({
  namePrefix,
  methods,
}: {
  namePrefix: string;
  methods: any;
}) {
  const { control, formState } = methods;
  const { errors } = formState;

  const telefoneName = makeName<ContatoInput>(namePrefix, 'telefone');
  const whatsappName = makeName<ContatoInput>(namePrefix, 'whatsapp');
  const emailName = makeName<ContatoInput>(namePrefix, 'email');

  return (
    <>
      <FormInput
        name={telefoneName}
        control={control}
        maskProps={{ mask: '(00) 0000-0000' }}
        label="Telefone"
        placeholder="(00) 0000-0000"
        errors={errors}
      />

      <FormInput
        name={whatsappName}
        control={control}
        maskProps={{ mask: '(00) 00000-0000' }}
        label="Celular/WhatsApp"
        placeholder="(00) 00000-0000"
        errors={errors}
      />

      <FormInput
        name={emailName}
        control={control}
        label="E-mail"
        placeholder="comercialaura@gmail.com"
        type="email"
        errors={errors}
      />
    </>
  );
}
export function ContatoForm({
  namePrefix = 'contatos[0]',
  onSubmit,
}: ContatoFormProps) {
  const mode = 'context';
  const methods = useSafeForm<ContatoInput>({
    useFormProps: { resolver: zodResolver(contatoSchema) },
    mode,
  });

  return <ContatoFormInner namePrefix={namePrefix} methods={methods} />;
}

export default ContatoForm;
