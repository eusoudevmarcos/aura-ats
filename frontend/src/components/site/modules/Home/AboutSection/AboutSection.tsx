// src/modules/Home/AboutSection/AboutSection.tsx
import React from 'react';
import { FaGem, FaHandshake, FaHeart, FaLightbulb } from 'react-icons/fa'; // Ícones para os valores

const AboutSection: React.FC = () => {
  const values = [
    {
      icon: <FaGem />,
      title: 'Excelência com Eficiência',
      description:
        'Com mais de 15 anos de experiência em recrutamento estratégico, entregamos resultados superiores com uma agilidade incomparável. Nossos processos são otimizados para encontrar o talento exato que sua empresa precisa, no tempo certo.',
    },
    {
      icon: <FaLightbulb />,
      title: 'Inovação Constante',
      description:
        'A tecnologia é nossa aliada na busca pela perfeição. Investimos em ferramentas e metodologias de ponta, garantindo processos de seleção inteligentes, precisos e à frente do mercado.',
    },
    {
      icon: <FaHandshake />,
      title: 'Comprometimento e Transparência',
      description:
        'Nossa parceria é construída sobre a confiança. Atuamos com total clareza em todas as etapas do processo, mantendo você informado(a) e envolvido(a). Nossa dedicação é integral aos seus objetivos.',
    },
    {
      icon: <FaHeart />,
      title: 'Humanização com Agilidade',
      description:
        'Acreditamos que o fator humano é insubstituível. Valorizamos as pessoas, suas ambições e necessidades. Combinamos essa abordagem empática com a agilidade necessária para um mercado competitivo.',
    },
  ];

  return (
    <section
      id="about-section"
      className="max-w-[1420px] mx-auto text-center text-gray-900 flex flex-col 
      gap-15 md:gap-30"
    >
      <div>
        <h2 className="text-primary text-3xl md:text-4xl font-bold mb-6">
          Sobre a Aura: O Match Perfeito para o Seu Sucesso
        </h2>
        <p className="text-md text-gray-500 mx-auto leading-relaxed text-justify">
          Na Aura, não apenas encontramos talentos, construímos o futuro do seu
          negócio. Com apenas 8 anos de mercado mas com profissionais que
          dominam o mercado com mais de 15 anos de experiência trabalhando com
          pessoas, somos especialistas em conectar empresas inovadoras a
          profissionais que impulsionam o sucesso. Nossa abordagem única combina
          a precisão da tecnologia com a intuição humana, garantindo resultados
          excepcionais em tempo recorde.
        </p>
      </div>

      <div>
        <h3 className="text-2xl md:text-3xl text-primary font-bold mb-6 text-center">
          Nossa Missão
        </h3>
        <p className="text-justify md:text-lg text-gray-500 leading-relaxed">
          Superar as expectativas de nossos clientes e candidatos, oferecendo
          soluções de recrutamento e seleção personalizadas, ágeis e eficazes.
          Queremos ser reconhecidos como o parceiro estratégico que entende e
          antecipa as necessidades do mercado, impulsionando o crescimento de
          empresas e a realização profissional de indivíduos.
        </p>
      </div>

      <div>
        <h3 className="text-2xl md:text-3xl text-primary font-bold mb-6">
          Nossos Valores: A Essência da Nossa Singularidade
        </h3>
        <p className="text-gray-700">
          Estes são os pilares que sustentam nossa jornada e nos diferenciam no
          mercado:
        </p>
      </div>

      <div className="grid grid-cols-2 gap-10 mt-8 md:grid-cols-2 sm:grid-cols-1">
        {values.map((value, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center flex flex-col items-center transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md text-gray-900"
          >
            <div className="text-5xl text-accent bg-accent/10 w-[90px] h-[90px] flex items-center justify-center mb-4 rounded-full sm:text-4xl sm:w-[50px] sm:h-[50px]">
              {value.icon}
            </div>
            <h4 className="text-primary text-xl md:text-2xl font-semibold mb-2 sm:text-lg">
              {value.title}
            </h4>
            <p className="text-gray-500">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
