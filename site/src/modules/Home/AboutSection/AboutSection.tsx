// src/modules/Home/AboutSection/AboutSection.tsx
import React from 'react';
import styles from './AboutSection.module.css';
import { FaGem, FaLightbulb, FaHandshake, FaHeart } from 'react-icons/fa'; // Ícones para os valores

const AboutSection: React.FC = () => {
  const values = [
    {
      icon: <FaGem />,
      title: 'Excelência com Eficiência',
      description: 'Com mais de 15 anos de experiência em recrutamento estratégico, entregamos resultados superiores com uma agilidade incomparável. Nossos processos são otimizados para encontrar o talento exato que sua empresa precisa, no tempo certo.',
    },
    {
      icon: <FaLightbulb />,
      title: 'Inovação Constante',
      description: 'A tecnologia é nossa aliada na busca pela perfeição. Investimos em ferramentas e metodologias de ponta, garantindo processos de seleção inteligentes, precisos e à frente do mercado.',
    },
    {
      icon: <FaHandshake />,
      title: 'Comprometimento e Transparência',
      description: 'Nossa parceria é construída sobre a confiança. Atuamos com total clareza em todas as etapas do processo, mantendo você informado(a) e envolvido(a). Nossa dedicação é integral aos seus objetivos.',
    },
    {
      icon: <FaHeart />,
      title: 'Humanização com Agilidade',
      description: 'Acreditamos que o fator humano é insubstituível. Valorizamos as pessoas, suas ambições e necessidades. Combinamos essa abordagem empática com a agilidade necessária para um mercado competitivo.',
    },
  ];

  return (
    <section id="about-section" className={styles.sectionContainer}>
      <h2 className={styles.title}>Sobre a Aura: O Match Perfeito para o Seu Sucesso</h2>
      <p className={styles.introText}>
        Na Aura, não apenas encontramos talentos, construímos o futuro do seu negócio. Com apenas 8 anos de mercado mas com profissionais que dominam o mercado com mais de 15 anos de experiência trabalhando com pessoas, somos especialistas em conectar empresas inovadoras a profissionais que impulsionam o sucesso. Nossa abordagem única combina a precisão da tecnologia com a intuição humana, garantindo resultados excepcionais em tempo recorde.
      </p>

      <div className={styles.mission}>
        <h3>Nossa Missão</h3>
        <p>
          Superar as expectativas de nossos clientes e candidatos, oferecendo soluções de recrutamento e seleção personalizadas, ágeis e eficazes. Queremos ser reconhecidos como o parceiro estratégico que entende e antecipa as necessidades do mercado, impulsionando o crescimento de empresas e a realização profissional de indivíduos.
        </p>
      </div>

      <div className={styles.valuesTitle}>
        <h3>Nossos Valores: A Essência da Nossa Singularidade</h3>
        <p>
          Estes são os pilares que sustentam nossa jornada e nos diferenciam no mercado:
        </p>
      </div>

      <div className={styles.valuesGrid}>
        {values.map((value, index) => (
          <div key={index} className={styles.valueCard}>
            <div className={styles.iconWrapper}>{value.icon}</div>
            <h4>{value.title}</h4>
            <p>{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;