import Card from '@/components/Card';
import { ClienteWithEmpresaAndPlanosSchema } from '@/schemas/cliente.schema';

interface ClienteInfoProps {
  cliente: ClienteWithEmpresaAndPlanosSchema;
  variant?: 'mini' | 'full';
}

const ClienteInfo: React.FC<ClienteInfoProps> = ({
  cliente,
  variant = 'full',
}) => {
  if (variant === 'mini') {
    return (
      <div className="flex flex-col">
        <div>
          <span className="font-medium text-primary">CNPJ:</span>
          <span className="text-secondary ml-2">
            {cliente.empresa.cnpj
              ? cliente.empresa.cnpj.replace(
                  /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                  '$1.$2.$3/$4-$5'
                )
              : ''}
          </span>
        </div>

        {cliente.status && (
          <div className="flex gap-2 flex-wrap">
            <span className="font-medium text-primary">Status:</span>
            <span className="bg-[#ede9fe] text-secondary text-xs font-semibold px-3 py-1 rounded-full border border-secondary">
              {cliente.status}
            </span>
          </div>
        )}

        {cliente.empresa && (
          <div className="flex flex-col gap-1">
            <div>
              <span className="font-medium text-primary">Razão Social:</span>
              <span className="text-secondary ml-2">
                {cliente.empresa.razaoSocial}
              </span>
            </div>
          </div>
        )}

        {cliente?.usuarioSistema?.email && (
          <div className="flex flex-col gap-1">
            <div>
              <span className="font-medium text-primary">E-mail:</span>
              <span className="text-secondary ml-2">
                {cliente?.usuarioSistema?.email}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-wrap gap-2">
      {cliente.empresa && (
        <>
          <div>
            <span className="font-medium text-primary">Razão Social:</span>
            <span className="text-secondary ml-2">
              {cliente.empresa.razaoSocial}
            </span>
          </div>
          <div>
            <span className="font-medium text-primary">Nome Fantasia:</span>
            <span className="text-secondary ml-2">
              {cliente.empresa.nomeFantasia}
            </span>
          </div>
          <div>
            <span className="font-medium text-primary">CNPJ:</span>
            <span className="text-secondary ml-2">
              {cliente.empresa.cnpj
                ? cliente.empresa.cnpj.replace(
                    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                    '$1.$2.$3/$4-$5'
                  )
                : ''}
            </span>
          </div>
          {cliente.empresa.dataAbertura && (
            <div>
              <span className="font-medium text-primary">
                Data de Abertura:
              </span>
              <span className="text-secondary ml-2">
                {cliente.empresa.dataAbertura.toString()}
              </span>
            </div>
          )}
        </>
      )}

      {cliente?.usuarioSistema?.email && (
        <div>
          <span className="font-medium text-primary">Email:</span>
          <span className="ml-2  text-secondary font-semibold">
            {cliente.usuarioSistema.email}
          </span>
        </div>
      )}

      <div>
        <span className="font-medium text-primary">Status:</span>
        <span className="ml-2 bg-[#ede9fe] text-secondary text-xs font-semibold px-3 py-1 rounded-full border border-secondary">
          {cliente.status}
        </span>
      </div>

      {cliente.empresa.representantes &&
        cliente.empresa.representantes.length > 0 && (
          <Card title="Dados do representante">
            <div>
              {cliente.empresa.representantes.map((representante: any) => {
                return (
                  <div key={representante.nome}>
                    <p>
                      <span className="font-medium text-primary">CPF:</span>{' '}
                      <span className="text-secondary">
                        {representante.cpf}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-primary">
                        Data Nascimento:
                      </span>{' '}
                      <span className="text-secondary">
                        {representante.dataNascimento.toString()}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-primary">Nome:</span>{' '}
                      <span className="text-secondary">
                        {representante.nome}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
    </div>
  );
};

export default ClienteInfo;
