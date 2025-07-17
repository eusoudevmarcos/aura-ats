// frontend/components/Clients/ClientList.tsx
import React, { useState } from 'react';
import styles from './Clients.module.css'; // Importa o módulo CSS específico de Clientes

interface Client {
  id: string;
  name: string;
  contactEmail: string;
  company: string;
  status: 'active' | 'inactive' | 'lead';
}

const ClientList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // Dados mockados: Em um projeto real, estes viriam do seu backend (API)
  const clients: Client[] = [
    { id: 'c1', name: 'Empresa Alpha', contactEmail: 'contato@alpha.com', company: 'Alpha Solutions', status: 'active' },
    { id: 'c2', name: 'João da Silva', contactEmail: 'joao@beta.com', company: 'Beta Corp', status: 'lead' },
    { id: 'c3', name: 'Tecno Inovação Ltda.', contactEmail: 'info@tecno.com', company: 'Tecno Inovação', status: 'active' },
    { id: 'c4', name: 'Maria Oliveira', contactEmail: 'maria@gama.com', company: 'Gama Services', status: 'inactive' },
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.clientsSection}>
      <div className={styles.clientsHeader}>
        <h3 className={styles.clientsTitle}>Lista de Clientes</h3>
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.clientsSearchInput}
        />
      </div>
      <table className={styles.clientsTable}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Empresa</th>
            <th>Email de Contato</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map(client => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.company}</td>
              <td>{client.contactEmail}</td>
              <td>
                <span className={`${styles.statusPill} ${styles[client.status]}`}>
                  {client.status === 'active' ? 'Ativo' : client.status === 'inactive' ? 'Inativo' : 'Lead'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredClients.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280' }}>Nenhum cliente encontrado.</p>
      )}
    </div>
  );
};

export default ClientList;
