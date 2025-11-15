import AgendaList from '@/components/list/AgendaList';
import AtividadeLayout from '@/layout/AtividadesLayout';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';

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
      <SessionProvider>
        <AgendaList noTitle />
      </SessionProvider>
    </AtividadeLayout>
  );
}
