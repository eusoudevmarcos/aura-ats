// frontend/components/Vagas/VagasForm.tsx
import React, { useState } from 'react';
import styles from './Vagas.module.css'; // Importa o módulo CSS específico de Vagas

interface VagasFormProps {
  onClose: () => void;
}

const VagasForm: React.FC<VagasFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    status: 'open',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados da Vaga:', formData);
    // Aqui você faria a chamada para a API para cadastrar a vaga
    onClose(); // Fecha o modal após o envio
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.cardTitle}>Cadastrar Nova Vaga</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.formLabel}>Título da Vaga:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="company" className={styles.formLabel}>Empresa:</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location" className={styles.formLabel}>Localização:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.formLabel}>Descrição:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.formTextarea}
              rows={4}
              required
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="requirements" className={styles.formLabel}>Requisitos (separados por vírgula):</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              className={styles.formTextarea}
              rows={3}
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.formLabel}>Status:</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={styles.formSelect}
              required
            >
              <option value="open">Aberta</option>
              <option value="hiring">Contratando</option>
              <option value="closed">Fechada</option>
            </select>
          </div>

          <div className={styles.formButtons}>
            <button type="submit" className={styles.submitButton}>Cadastrar</button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VagasForm;
