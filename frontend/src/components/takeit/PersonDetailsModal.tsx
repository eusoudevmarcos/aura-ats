import styles from '@/styles/takeit.module.scss';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Tipos para os detalhes
type TipoPessoa = 'persons' | 'companies';

interface Endereco {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  [key: string]: string | number | boolean;
}

interface Telefone {
  tipo: string;
  numero: string;
  [key: string]: string | number | boolean;
}

interface Documento {
  tipo: string;
  numero: string;
  [key: string]: string | number | boolean;
}

interface DetalhesPessoa {
  dadosBasicos?: { [key: string]: string | number | boolean };
  enderecos?: Endereco[];
  telefones?: Telefone[];
  emails?: string[];
  documentos?: Documento[];
}

interface PersonDetailsModalProps {
  itemId: string | number;
  type: TipoPessoa;
  onClose: () => void;
}

const PersonDetailsModal: React.FC<PersonDetailsModalProps> = ({
  itemId,
  type,
  onClose,
}) => {
  const [details, setDetails] = useState<DetalhesPessoa | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('dadosBasicos');

  useEffect(() => {
    if (itemId && type) {
      fetchDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, type]);

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint =
        type === 'persons'
          ? `http://localhost:3001/api/persons/details/${itemId}`
          : `http://localhost:3001/api/companies/details/${itemId}`;

      const response = await axios.get(endpoint);

      if (response.data.success) {
        setDetails(response.data.data as DetalhesPessoa);
      } else {
        setError(response.data.message || 'Erro ao carregar detalhes.');
      }
    } catch (err) {
      console.log(err);
      setError('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const tabs: string[] = [
    'dadosBasicos',
    'enderecos',
    'telefones',
    'emails',
    'documentos',
  ];

  const renderTabContent = () => {
    if (!details) return null;

    switch (activeTab) {
      case 'dadosBasicos':
        return (
          <div>
            {Object.entries(details.dadosBasicos || {}).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {String(value)}
              </p>
            ))}
          </div>
        );
      case 'enderecos':
        return (
          <ul>
            {(details.enderecos || []).map((end: Endereco, idx: number) => (
              <li key={idx}>
                {end.logradouro}, {end.numero} - {end.bairro} - {end.cidade}/
                {end.uf} - CEP: {end.cep}
              </li>
            ))}
          </ul>
        );
      case 'telefones':
        return (
          <ul>
            {(details.telefones || []).map((tel: Telefone, idx: number) => (
              <li key={idx}>
                {tel.tipo}: {tel.numero}
              </li>
            ))}
          </ul>
        );
      case 'emails':
        return (
          <ul>
            {(details.emails || []).map((email: string, idx: number) => (
              <li key={idx}>{email}</li>
            ))}
          </ul>
        );
      case 'documentos':
        return (
          <ul>
            {(details.documentos || []).map((doc: Documento, idx: number) => (
              <li key={idx}>
                {doc.tipo}: {doc.numero}
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  if (!itemId) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.modalCloseButton}>
          Fechar
        </button>

        <h2>Detalhes do {type === 'persons' ? 'Consumidor' : 'Empresa'}</h2>

        {loading && <p>Carregando detalhes...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && details && (
          <>
            <div className={styles.tabNavigation}>
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`${styles.tabButton} ${
                    activeTab === tab ? styles.active : ''
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="tab-content">{renderTabContent()}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default PersonDetailsModal;
