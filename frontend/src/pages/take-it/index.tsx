// frontend/src/App.tsx
import React, { useState } from "react";
import Table from "@/components/takeit/Table";
import PersonDetailsModal from "@/components/takeit/PersonDetailsModal";
import styles from "@/styles/takeit.module.scss";
import TakeitLayout from "@/layout/takeitLayout";

// Tipos para os dados de resultado e item selecionado
type TypeColumns = "persons" | "companies";

interface ResultItem {
  id: string | number;
  type: TypeColumns;
  [key: string]: any;
}

const App: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ResultItem | null>(null);

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <TakeitLayout>
      {({ results, loading, typeColumns }) => (
        <div className={`${styles.container} shadow-md`}>
          <Table
            data={results || []}
            onSelect={handleSelectItem}
            typeColumns={typeColumns}
            loading={loading}
          />

          {selectedItem && (
            <PersonDetailsModal
              itemId={selectedItem.id}
              type={selectedItem.type}
              onClose={handleCloseModal}
            />
          )}
        </div>
      )}
    </TakeitLayout>
  );
};

export default App;
