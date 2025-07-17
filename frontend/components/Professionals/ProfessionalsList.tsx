import React, { useState } from 'react';
import styles from '../Cards/Cards.module.css'; // Reutiliza o módulo CSS de Cards

interface Professional {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastActivity: string;
}

const ProfessionalsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // Dados mockados: Em um projeto real, estes viriam do seu backend (API)
  const professionals: Professional[] = [
    { id: '1', name: 'Ana Souza', role: 'Desenvolvedora Frontend', status: 'active', lastActivity: '2 dias atrás' },
    { id: '2', name: 'Bruno Lima', role: 'Engenheiro de Dados', status: 'pending', lastActivity: '1 semana atrás' },
    { id: '3', name: 'Carla Dias', role: 'Designer UX/UI', status: 'active', lastActivity: '3 horas atrás' },
    { id: '4', name: 'Daniel Rocha', role: 'Gerente de Projetos', status: 'inactive', lastActivity: '1 mês atrás' },
    { id: '5', name: 'Elisa Costa', role: 'Analista de RH', status: 'active', lastActivity: 'Ontem' },
  ];

  const filteredProfessionals = professionals.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${styles.card} ${styles.professionalsSection}`}>
      <div className={styles.professionalsHeader}>
        <h3 className={styles.professionalsTitle}>Lista de Profissionais</h3>
        <input
          type="text"
          placeholder="Buscar profissional..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.professionalsSearchInput}
        />
      </div>
      <table className={styles.professionalsTable}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Função</th>
            <th>Status</th>
            <th>Última Atividade</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfessionals.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.role}</td>
              <td>
                <span className={`${styles.statusPill} ${styles[p.status]}`}>
                  {p.status === 'active' ? 'Ativo' : p.status === 'inactive' ? 'Inativo' : 'Pendente'}
                </span>
              </td>
              <td>{p.lastActivity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredProfessionals.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280' }}>Nenhum profissional encontrado.</p>
      )}
    </div>
  );
};

export default ProfessionalsList;