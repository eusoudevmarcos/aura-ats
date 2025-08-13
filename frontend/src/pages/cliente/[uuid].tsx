// pages/cliente/[uuid].tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "@/axios";
import { EditPenIcon, TrashIcon } from "@/components/icons";
import Modal from "@/components/modal/Modal";
import Card from "@/components/Card";
import ClienteForm from "@/components/form/ClienteForm";
import { ClienteInput } from "@/schemas/cliente.schema";

const ClientePage: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;

  const [cliente, setCliente] = useState<ClienteInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [showModalEdit, setShowModalEdit] = useState(false);

  useEffect(() => {
    if (!uuid) return;

    const fetchCliente = async () => {
      setLoading(true);
      setErro(null);
      try {
        const res = await api.get(`/api/cliente/${uuid}`);
        setCliente(res.data);
      } catch (_) {
        setErro("Cliente não encontrado ou erro ao buscar dados.");
        setCliente(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [uuid]);

  const handleTrash = async () => {
    if (!cliente) return;
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await api.delete(`/api/cliente/${cliente.id}`);
        router.push("/clientes");
      } catch {
        alert("Erro ao excluir cliente.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#48038a]"></div>
        <span className="ml-4 text-[#48038a] text-lg">Carregando...</span>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <span className="text-red-600 text-xl font-semibold mb-4">{erro}</span>
      </div>
    );
  }

  if (!cliente) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <section className="bg-white p-4 rounded-2xl">
        <div className="flex mb-8">
          <button
            className="px-2 py-2 bg-[#8c53ff] text-white rounded shadow-md hover:scale-110"
            onClick={() => router.back()}
          >
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-center text-[#48038a] w-full">
            Detalhes do Cliente
          </h1>

          <div className="flex gap-2">
            <button
              className="px-2 py-2 bg-[#5f82f3] text-white rounded shadow-md hover:scale-110"
              onClick={() => setShowModalEdit(true)}
            >
              <EditPenIcon />
            </button>
            <button
              className="px-2 py-2 bg-[#f72929] text-white rounded shadow-md hover:scale-110"
              onClick={handleTrash}
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Card title="Informações do Cliente">
            <div>
              <span className="font-medium">Status:</span>

              <span className="ml-2 bg-[#ede9fe] text-[#48038a] text-xs font-semibold px-3 py-1 rounded-full border border-[#8c53ff]">
                {cliente.status}
              </span>
            </div>
            <div>
              <span className="font-medium">Tipo de Serviço:</span>
              {cliente.tipoServico.map((tipo, idx) => (
                <span
                  key={idx}
                  className="ml-2 bg-[#ede9fe] text-[#48038a] text-xs font-semibold px-3 py-1 rounded-full border border-[#8c53ff]"
                >
                  {tipo.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </Card>
          {/* Empresa */}
          {cliente.empresa && (
            <Card title="Dados da Empresa">
              <div>
                <span className="font-medium">Razão Social:</span>
                {cliente.empresa.razaoSocial}
              </div>
              <div>
                <span className="font-medium">CNPJ:</span>
                {cliente.empresa.cnpj}
              </div>
              {cliente.empresa.dataAbertura && (
                <div>
                  <span className="font-medium">Data de Abertura:</span>
                  {new Date(cliente.empresa.dataAbertura).toLocaleDateString(
                    "pt-BR"
                  )}
                </div>
              )}
            </Card>
          )}
          {/* Profissional
          {cliente.profissional && cliente.profissional.pessoa && (
            <Card title="Profissional Associado">
              <div>
                <span className="font-medium">Área:</span>
                {cliente.profissional.area}
              </div>
              <div>
                <span className="font-medium">Nome:</span>
                {cliente.profissional.pessoa.nome}
              </div>
              {cliente.profissional.crm && (
                <div>
                  <span className="font-medium">CRM:</span>
                  {cliente.profissional.crm}
                </div>
              )}
              {cliente.profissional.corem && (
                <div>
                  <span className="font-medium">COREM:</span>
                  {cliente.profissional.corem}
                </div>
              )}
            </Card>
          )} */}
          {/* Contatos */}
          {cliente.empresa?.contatos?.length > 0 && (
            <Card title="Contatos da Empresa">
              {cliente.empresa.contatos.map((contato: any) => (
                <div key={contato.id} className="mb-2">
                  {contato.email && <div>Email: {contato.email}</div>}
                  {contato.telefone && <div>Telefone: {contato.telefone}</div>}
                  {contato.whatsapp && <div>WhatsApp: {contato.whatsapp}</div>}
                </div>
              ))}
            </Card>
          )}
          {/* Localizações */}
          {cliente.empresa?.localizacoes?.length > 0 && (
            <Card title="Localizações">
              {cliente.empresa.localizacoes.map((loc: any) => (
                <ul key={loc.id} className="mb-2 list-inside">
                  {loc.cidade && (
                    <li>
                      <span className="font-medium">Cidade:</span> {loc.cidade}
                    </li>
                  )}
                  {loc.estado && (
                    <li>
                      <span className="font-medium">Estado:</span> {loc.estado}
                    </li>
                  )}
                  {loc.cep && (
                    <li>
                      <span className="font-medium">CEP:</span> {loc.cep}
                    </li>
                  )}
                  {loc.bairro && (
                    <li>
                      <span className="font-medium">Bairro:</span> {loc.bairro}
                    </li>
                  )}
                  {loc.uf && (
                    <li>
                      <span className="font-medium">UF:</span> {loc.uf}
                    </li>
                  )}
                  {loc.complemento && (
                    <li>
                      <span className="font-medium">Complemento:</span>
                      {loc.complemento}
                    </li>
                  )}
                  {loc.logradouro && (
                    <li>
                      <span className="font-medium">Logradouro:</span>
                      {loc.logradouro}
                    </li>
                  )}
                  {loc.regiao && (
                    <li>
                      <span className="font-medium">Região:</span> {loc.regiao}
                    </li>
                  )}
                </ul>
              ))}
            </Card>
          )}
        </div>
      </section>

      <Modal
        isOpen={showModalEdit}
        onClose={() => setShowModalEdit(false)}
        title="Editar Cliente"
      >
        <ClienteForm onSuccess={() => {}} initialValues={cliente} />
      </Modal>
    </div>
  );
};

export default ClientePage;
