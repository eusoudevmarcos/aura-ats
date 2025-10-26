// frontend/src/components/examples/PlanoAccessExample.tsx
import PlanoGuard from '@/components/auth/PlanoGuard';
import { usePlanoAccess } from '@/hook/usePlanoAccess';
import React from 'react';

const PlanoAccessExample: React.FC = () => {
  const { canAccessFeature, getPlanoInfo } = usePlanoAccess();
  const planoInfo = getPlanoInfo();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Exemplo de Controle de Acesso por Plano
      </h1>

      {/* Informações do Plano */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">
          Informações do Plano
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Plano Ativo:</span>
            <span className="ml-2 text-blue-600">{planoInfo.nome}</span>
          </div>
          <div>
            <span className="font-medium">Tipo:</span>
            <span className="ml-2 text-blue-600">{planoInfo.tipo}</span>
          </div>
          <div>
            <span className="font-medium">Usos Disponíveis:</span>
            <span className="ml-2 text-blue-600">
              {planoInfo.usosDisponiveis}
            </span>
          </div>
          <div>
            <span className="font-medium">Pode Consultar Profissionais:</span>
            <span className="ml-2 text-blue-600">
              {planoInfo.podeConsultarProfissionais ? 'Sim' : 'Não'}
            </span>
          </div>
        </div>
      </div>

      {/* Funcionalidades com Controle de Acesso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Consultar Profissionais */}
        <PlanoGuard requireUso={true}>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Consultar Profissionais
            </h3>
            <p className="text-gray-600 mb-4">
              Acesse a base de dados de profissionais qualificados.
            </p>
            <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              Acessar Base de Profissionais
            </button>
          </div>
        </PlanoGuard>

        {/* Gerenciar Vagas */}
        <PlanoGuard requiredPlano="premium">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Gerenciar Vagas
            </h3>
            <p className="text-gray-600 mb-4">
              Crie e gerencie suas vagas de emprego.
            </p>
            <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              Gerenciar Vagas
            </button>
          </div>
        </PlanoGuard>

        {/* Relatórios Avançados */}
        <PlanoGuard requiredPlano="empresarial">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Relatórios Avançados
            </h3>
            <p className="text-gray-600 mb-4">
              Acesse relatórios detalhados e análises avançadas.
            </p>
            <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              Ver Relatórios
            </button>
          </div>
        </PlanoGuard>

        {/* Suporte Prioritário */}
        <PlanoGuard requiredPlano="premium">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Suporte Prioritário
            </h3>
            <p className="text-gray-600 mb-4">
              Acesso prioritário ao suporte técnico.
            </p>
            <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              Contatar Suporte
            </button>
          </div>
        </PlanoGuard>
      </div>

      {/* Status das Funcionalidades */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Status das Funcionalidades
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                canAccessFeature('consultar_profissionais')
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            ></span>
            <span>Consultar Profissionais</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                canAccessFeature('gerenciar_vagas')
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            ></span>
            <span>Gerenciar Vagas</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                canAccessFeature('relatorios_avancados')
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            ></span>
            <span>Relatórios Avançados</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                canAccessFeature('suporte_prioritario')
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            ></span>
            <span>Suporte Prioritário</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanoAccessExample;
