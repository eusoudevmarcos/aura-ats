// frontend/src/hook/usePlanoAccess.ts
import { usePlano } from '@/context/AuthContext';

export const usePlanoAccess = () => {
  const {
    planos,
    podeConsultarProfissionais,
    usosDisponiveis,
    temPlanoComUso,
  } = usePlano();

  const hasPlano = (planoName: string): boolean => {
    return planos.some(
      plano =>
        plano.nome.toLowerCase().includes(planoName.toLowerCase()) &&
        plano.status === 'ATIVA'
    );
  };

  const canAccessFeature = (feature: string): boolean => {
    switch (feature) {
      case 'consultar_profissionais':
        return podeConsultarProfissionais;
      case 'gerenciar_vagas':
        return hasPlano('premium') || hasPlano('empresarial');
      case 'relatorios_avancados':
        return hasPlano('empresarial');
      case 'suporte_prioritario':
        return hasPlano('premium') || hasPlano('empresarial');
      default:
        return true;
    }
  };

  const getPlanoInfo = () => {
    const planoAtivo = planos.find(plano => plano.status === 'ATIVA');
    return {
      nome: planoAtivo?.nome || 'Nenhum plano ativo',
      tipo: planoAtivo?.tipo || 'N/A',
      usosDisponiveis,
      temPlanoComUso,
      podeConsultarProfissionais,
    };
  };

  return {
    planos,
    usosDisponiveis,
    temPlanoComUso,
    podeConsultarProfissionais,
    hasPlano,
    canAccessFeature,
    getPlanoInfo,
  };
};
