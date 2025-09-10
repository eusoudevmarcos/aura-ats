import React from 'react';

const DashboardCliente: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: 500,
        margin: '60px auto',
        padding: 32,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      }}
    >
      <h1 style={{ color: '#1e293b', marginBottom: 16 }}>
        Bem-vindo ao Painel do Cliente
      </h1>
      <p style={{ color: '#475569', fontSize: 18 }}>
        Aqui você pode acompanhar suas atividades, visualizar informações e
        acessar funcionalidades exclusivas para clientes.
      </p>
      <div style={{ marginTop: 32 }}>
        <ul style={{ color: '#334155', fontSize: 16, lineHeight: '2em' }}>
          <li>✔️ Visualize suas vagas e processos</li>
          <li>✔️ Acompanhe o status das suas solicitações</li>
          <li>✔️ Atualize seus dados cadastrais</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardCliente;
