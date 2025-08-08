// frontend/components/Cards/RecentActivityCard.tsx
import React from 'react';
// Em seu projeto Next.js real, você usaria: import styles from './Cards.module.css';
// Para o ambiente do Canvas, as classes são aplicadas diretamente como strings.
import { DotIcon, ClockIcon } from '../icons'; // Importa os ícones

const RecentActivityCard: React.FC = () => {
  return (
    <div className="card"> {/* Alterado de styles.card para "card" */}
      <h3 className="cardTitle">Atividade Recente</h3> {/* Alterado de styles.cardTitle para "cardTitle" */}
      <ul className="activityList"> {/* Alterado de styles.activityList para "activityList" */}
        <li className="activityItem"> {/* Alterado de styles.activityItem para "activityItem" */}
          <DotIcon className="activityDot" /> {/* Alterado de styles.activityDot para "activityDot" */}
          <div>
            <p className="activityText"> {/* Alterado de styles.activityText para "activityText" */}
              <strong>João Silva</strong> adicionou um novo candidato <strong>Maria Oliveira</strong>.
            </p>
            <p className="activityTime"> {/* Alterado de styles.activityTime para "activityTime" */}
              <ClockIcon /> 10 minutos atrás
            </p>
          </div>
        </li>
        <li className="activityItem"> {/* Alterado de styles.activityItem para "activityItem" */}
          <DotIcon className="activityDot" /> {/* Alterado de styles.activityDot para "activityDot" */}
          <div>
            <p className="activityText"> {/* Alterado de styles.activityText para "activityText" */}
              <strong>Você</strong> agendou uma entrevista com <strong>Pedro Santos</strong> para Vaga de Desenvolvedor.
            </p>
            <p className="activityTime"> {/* Alterado de styles.activityTime para "activityTime" */}
              <ClockIcon /> 1 hora atrás
            </p>
          </div>
        </li>
        <li className="activityItem"> {/* Alterado de styles.activityItem para "activityItem" */}
          <DotIcon className="activityDot" /> {/* Alterado de styles.activityDot para "activityDot" */}
          <div>
            <p className="activityText"> {/* Alterado de styles.activityText para "activityText" */}
              <strong>Equipe de RH</strong> atualizou o status da Vaga de Marketing.
            </p>
            <p className="activityTime"> {/* Alterado de styles.activityTime para "activityTime" */}
              <ClockIcon /> 3 horas atrás
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default RecentActivityCard;
