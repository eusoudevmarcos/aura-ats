import React, { useState } from 'react';
import styles from '../Cards/Cards.module.css'; // Importa o módulo CSS de Cards

const ActivitySection: React.FC = () => {
  const [activeSubMenu, setActiveSubMenu] = useState('Agendas');

  const renderActivityContent = () => {
    switch (activeSubMenu) {
      case 'Agendas':
        return (
          <div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#1f2937' }}>Próximas Agendas</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #e5e7eb' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#1f2937' }}>Entrevista com Maria Silva - Vaga Desenvolvedor Backend</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>Hoje, 14:00 - Sala de Reuniões 1</p>
              </li>
              <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #e5e7eb' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#1f2937' }}>Reunião de Alinhamento - Projeto X</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>Amanhã, 10:00 - Online</p>
              </li>
              <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #e5e7eb' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#1f2937' }}>Feedback com João Santos - Vaga Designer UX</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>Sexta-feira, 11:30 - Escritório</p>
              </li>
            </ul>
          </div>
        );
      case 'Tarefas':
        return (
          <div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#1f2937' }}>Minhas Tarefas</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #e5e7eb' }}>
                <input type="checkbox" style={{ marginRight: '0.5rem' }} />
                <span style={{ fontSize: '0.875rem', color: '#1f2937' }}>Revisar currículos para Vaga de Marketing</span>
                <p style={{ margin: '0.25rem 0 0 1.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Prazo: Hoje</p>
              </li>
              <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #e5e7eb' }}>
                <input type="checkbox" style={{ marginRight: '0.5rem' }} />
                <span style={{ fontSize: '0.875rem', color: '#1f2937' }}>Enviar proposta para Cliente ABC</span>
                <p style={{ margin: '0.25rem 0 0 1.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Prazo: Amanhã</p>
              </li>
            </ul>
          </div>
        );
      case 'Vagas':
        return (
          <div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#1f2937' }}>Vagas Abertas</h4>
            <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Listagem de vagas e seus status.</p>
          </div>
        );
      case 'Entrevistas':
        return (
          <div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#1f2937' }}>Entrevistas Agendadas</h4>
            <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Detalhes das entrevistas e candidatos.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.activitySection}>
      <h2 className={styles.activityHeader}>Atividade</h2>
      <nav className={styles.activityNav}>
        {['Agendas', 'Tarefas', 'Vagas', 'Entrevistas'].map((item) => (
          <button
            key={item}
            className={`${styles.activityNavItem} ${activeSubMenu === item ? styles.activityNavItemActive : ''}`}
            onClick={() => setActiveSubMenu(item)}
          >
            {item}
          </button>
        ))}
      </nav>
      <div className={styles.activityContent}>
        {renderActivityContent()}
      </div>
    </div>
  );
};

export default ActivitySection;