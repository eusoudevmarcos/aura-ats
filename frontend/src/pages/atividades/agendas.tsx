import AtividadeLayout from '@/layout/AtividadesLayout';
import { SessionProviderWrapper } from '@/components/providers/SessionProviderWrapper';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamic import para AgendaList
const AgendaList = dynamic(
  () => import('@/components/list/AgendaList'),
  {
    ssr: false,
  }
);

export default function Agendas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onSuccess = (msg: boolean) => {
    setIsModalOpen(!msg);
    setRefreshKey(refreshKey + 1);
  };

  return (
    <AtividadeLayout>
      <SessionProviderWrapper>
        <AgendaList noTitle />
      </SessionProviderWrapper>
    </AtividadeLayout>
  );
}
