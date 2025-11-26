import { ClienteWithEmpresaAndPlanosSchema } from '@/schemas/cliente.schema';
import { AdminGuard } from '../auth/AdminGuard';

interface ClienteInfoProps {
  cliente: ClienteWithEmpresaAndPlanosSchema;
  variant?: 'mini' | 'full';
}

// Ajuste: container padronizado para label e valor
const LabelController = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="font-medium text-primary">{label}</span>
      <span className={`${value ? 'text-secondary' : 'text-gray-400'}`}>
        {value ? value : 'N/A'}
      </span>
    </div>
  );
};

const StatusLabel = ({ status }: { status: string }) => (
  <div className="flex items-center gap-2 flex-wrap">
    <LabelController
      label="Status:"
      value={
        <span className="bg-[#ede9fe] text-secondary text-xs font-semibold px-3 py-1 rounded-full border border-secondary">
          {status}
        </span>
      }
    />
  </div>
);

const EmailLabel = ({
  email,
  isAdmin,
}: {
  email: string;
  isAdmin?: boolean;
}) => (
  <LabelController
    label="E-mail:"
    value={
      isAdmin ? (
        <AdminGuard typeText>
          <span className="text-secondary ml-2">{email}</span>
        </AdminGuard>
      ) : (
        <span className="text-secondary ml-2">{email}</span>
      )
    }
  />
);

const EmpresaInfo = ({ empresa }: { empresa: any }) => (
  <>
    {empresa.razaoSocial && (
      <LabelController
        label="Razão Social:"
        value={<span className="ml-2">{empresa.razaoSocial}</span>}
      />
    )}
    {empresa.nomeFantasia && (
      <LabelController
        label="Nome Fantasia:"
        value={<span className="ml-2">{empresa.nomeFantasia}</span>}
      />
    )}
    <LabelController
      label="CNPJ:"
      value={
        <span className="ml-2">
          {empresa.cnpj
            ? empresa.cnpj.replace(
                /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                '$1.$2.$3/$4-$5'
              )
            : ''}
        </span>
      }
    />
    {empresa.dataAbertura && (
      <LabelController
        label="Data de Abertura:"
        value={<span className="ml-2">{empresa.dataAbertura.toString()}</span>}
      />
    )}
  </>
);

const RepresentanteInfo = ({ representante }: { representante: any }) => (
  <div className="mb-2" key={representante.nome}>
    <LabelController label="CPF:" value={representante.cpf} />
    <LabelController label="Nome:" value={representante.nome} />
    <LabelController
      label="Data Nascimento:"
      value={representante.dataNascimento}
    />
    <LabelController label="Signo:" value={representante.signo} />
    <LabelController label="Sexo:" value={representante.sexo} />
  </div>
);

const ClienteInfo: React.FC<ClienteInfoProps> = ({
  cliente,
  variant = 'full',
}) => {
  if (variant === 'mini') {
    return (
      <div className="flex flex-col py-2">
        <LabelController
          label="CNPJ:"
          value={
            cliente.empresa.cnpj
              ? cliente.empresa.cnpj.replace(
                  /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                  '$1.$2.$3/$4-$5'
                )
              : ''
          }
        />
        {cliente.status && <StatusLabel status={cliente.status} />}
        {cliente.empresa && <EmpresaInfo empresa={cliente.empresa} />}
        {cliente.usuarioSistema?.email && (
          <EmailLabel email={cliente.usuarioSistema.email} />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-wrap">
      {cliente.empresa && (
        <>
          {cliente.usuarioSistema?.email && (
            <EmailLabel email={cliente.usuarioSistema.email} isAdmin />
          )}
          <EmpresaInfo empresa={cliente.empresa} />
        </>
      )}

      {cliente?.email && (
        <LabelController
          label="Email:"
          value={
            <span className="ml-2 text-secondary font-semibold">
              {cliente.email}
            </span>
          }
        />
      )}

      <StatusLabel status={cliente.status} />

      {cliente.empresa?.representantes &&
        cliente.empresa.representantes.length > 0 && (
          <div
            title="Dados do representante"
            className="border-y py-2 border-gray-200"
          >
            <h3 className="text-lg text-primary font-bold mb-2">
              Dados do representante
            </h3>
            {cliente.empresa.representantes.map((representante: any) => (
              <RepresentanteInfo
                representante={representante}
                key={representante.nome}
              />
            ))}
          </div>
        )}
    </div>
  );
};

export default ClienteInfo;
