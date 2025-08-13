import React, { useEffect, useState } from "react";
import api from "@/axios";
import { useRouter } from "next/router";
import { EditPenIcon, TrashIcon } from "@/components/icons";
import { FuncionarioForm } from "@/components/form/funcionarioForm";
import { FuncionarioInput } from "@/schemas/funcionario.schema";
import Modal from "@/components/modal/Modal";
import Card from "@/components/Card";

const FuncionarioPage: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;

  const [funcionario, setFuncionario] = useState<FuncionarioInput | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!uuid) return;

    const fetchFuncionario = async () => {
      setLoading(true);
      setErro(null);
      try {
        const response = await api.get(`/api/funcionario/${uuid}`);
        setFuncionario(response.data);
      } catch (_: any) {
        setErro("Funcionário não encontrado ou erro ao buscar dados.");
        setFuncionario(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionario();
  }, [uuid]);

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

  if (!funcionario) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <section className="bg-white p-4 rounded-2xl">
        <div className="flex mb-8">
          <button
            className="px-2 py-2 bg-[#8c53ff] text-white rounded shadow-md hover:scale-110 hover:duration-200 cursor-pointer"
            onClick={() => router.back()}
          >
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-center text-[#48038a] w-full">
            Detalhes do Funcionário
          </h1>

          <div className="flex gap-2">
            <button
              className="px-2 py-2 bg-[#5f82f3] text-white rounded shadow-md hover:scale-110 hover:duration-200 cursor-pointer"
              onClick={() => setShowModalEdit(true)}
            >
              <EditPenIcon />
            </button>
            <button
              className="px-2 py-2 bg-[#f72929] text-white rounded shadow-md hover:scale-110 hover:duration-200 cursor-pointer"
              // onClick={() => handleTrash()}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <Card title="Informações Gerais">
            <div>
              <span className="font-medium">Email:</span> {funcionario.email}
            </div>
            <div>
              <span className="font-medium">Tipo de Usuário:</span>{" "}
              {funcionario.tipoUsuario}
            </div>
            {funcionario.setor && (
              <div>
                <span className="font-medium">Setor:</span> {funcionario.setor}
              </div>
            )}
            {funcionario.cargo && (
              <div>
                <span className="font-medium">Cargo:</span> {funcionario.cargo}
              </div>
            )}
          </Card>
          {funcionario.pessoa && (
            <Card title="Dados da Pessoa">
              <div>
                <span className="font-medium">Nome:</span>{" "}
                {funcionario.pessoa.nome}
              </div>
              <div>
                <span className="font-medium">CPF:</span>{" "}
                {funcionario.pessoa.cpf}
              </div>
              <div>
                <span className="font-medium">Data de Nascimento:</span>{" "}
                {funcionario?.pessoa?.dataNascimento &&
                  new Date(
                    funcionario?.pessoa?.dataNascimento
                  ).toLocaleDateString("pt-BR")}
              </div>
              <div>
                <span className="font-medium">RG:</span> {funcionario.pessoa.rg}
              </div>
              <div>
                <span className="font-medium">Estado Civil:</span>{" "}
                {funcionario.pessoa.estadoCivil}
              </div>
            </Card>
          )}
          {funcionario.empresa && (
            <Card title="Dados da Empresa">
              <div>
                <span className="font-medium">Razão Social:</span>{" "}
                {funcionario.empresa.razaoSocial}
              </div>
              <div>
                <span className="font-medium">CNPJ:</span>{" "}
                {funcionario.empresa.cnpj}
              </div>
              {funcionario?.empresa?.dataAbertura && (
                <div>
                  <span className="font-medium">Data de Abertura:</span>{" "}
                  {new Date(
                    funcionario.empresa.dataAbertura as string
                  ).toLocaleDateString("pt-BR")}
                </div>
              )}
            </Card>
          )}
        </div>
      </section>

      <Modal
        isOpen={showModalEdit}
        onClose={() => setShowModalEdit(false)}
        title="Editar Funcionario"
      >
        <FuncionarioForm onSuccess={() => {}} funcionarioData={funcionario} />
      </Modal>
    </div>
  );
};

export default FuncionarioPage;
