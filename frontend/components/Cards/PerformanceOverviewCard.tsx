// frontend/components/Cards/PerformanceOverviewCard.tsx
import React from 'react';
import styles from './Cards.module.css'; // Importa o módulo CSS
import { ArrowUpRightIcon, ArrowDownRightIcon } from '../icons'; // Importa os ícones

const PerformanceOverviewCard: React.FC = () => {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Visão Geral de Desempenho</h3>
      <div className={styles.performanceGrid}>
        {/* Candidatos */}
        <div className={styles.performanceItem}>
          <p className={styles.performanceValue}>1,234</p>
          <p className={styles.performanceLabel}>Candidatos</p>
          <div className={`${styles.performanceChange} ${styles.positive}`}>
            <ArrowUpRightIcon /> 2.5%
          </div>
        </div>
        {/* Entrevistas */}
        <div className={styles.performanceItem}>
          <p className={styles.performanceValue}>456</p>
          <p className={styles.performanceLabel}>Entrevistas</p>
          <div className={`${styles.performanceChange} ${styles.positive}`}>
            <ArrowUpRightIcon /> 1.8%
          </div>
        </div>
        {/* Contratados */}
        <div className={styles.performanceItem}>
          <p className={styles.performanceValue}>123</p>
          <p className={styles.performanceLabel}>Contratados</p>
          <div className={`${styles.performanceChange} ${styles.negative}`}>
            <ArrowDownRightIcon /> 0.5%
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOverviewCard;
