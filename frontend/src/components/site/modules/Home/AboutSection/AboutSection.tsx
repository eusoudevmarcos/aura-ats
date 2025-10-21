// src/modules/Home/AboutSection/AboutSection.tsx
import React from 'react';
import { FaGem, FaHandshake, FaHeart, FaLightbulb } from 'react-icons/fa'; // Ícones para os valores

const AboutSection: React.FC = () => {
  const values = [
    {
      icon: <FaGem className="text-[#545454]" />,
      title: 'Excelência com Eficiência',
      description:
        'Com mais de 15 anos de experiência em recrutamento estratégico, entregamos resultados superiores com uma agilidade incomparável. Nossos processos são otimizados para encontrar o talento exato que sua empresa precisa, no tempo certo.',
    },
    {
      icon: <FaLightbulb className="text-[#545454]" />,
      title: 'Inovação Constante',
      description:
        'A tecnologia é nossa aliada na busca pela perfeição. Investimos em ferramentas e metodologias de ponta, garantindo processos de seleção inteligentes, precisos e à frente do mercado.',
    },
    {
      icon: <FaHandshake className="text-[#545454]" />,
      title: 'Comprometimento e Transparência',
      description:
        'Nossa parceria é construída sobre a confiança. Atuamos com total clareza em todas as etapas do processo, mantendo você informado(a) e envolvido(a). Nossa dedicação é integral aos seus objetivos.',
    },
    {
      icon: <FaHeart className="text-[#545454]" />,
      title: 'Humanização com Agilidade',
      description:
        'Acreditamos que o fator humano é insubstituível. Valorizamos as pessoas, suas ambições e necessidades. Combinamos essa abordagem empática com a agilidade necessária para um mercado competitivo.',
    },
  ];

  return (
    <section
      id="about-section"
      className="max-w-[1420px] mx-auto text-center text-gray-900 flex flex-col 
      gap-0"
    >
      <div>
        <h2 className="text-primary text-3xl md:text-4xl font-bold mb-2">
          Sobre a Aura: O Match Perfeito para o Seu Sucesso
        </h2>
        <p className="md:text-lg text-gray-500 mx-auto leading-relaxed text-justify max-w-[900px]">
          Na Aura, não apenas encontramos talentos, construímos o futuro do seu
          negócio. Com apenas 8 anos de mercado mas com profissionais que
          dominam o mercado com mais de 15 anos de experiência trabalhando com
          pessoas, somos especialistas em conectar empresas inovadoras a
          profissionais que impulsionam o sucesso. Nossa abordagem única combina
          a precisão da tecnologia com a intuição humana, garantindo resultados
          excepcionais em tempo recorde.
        </p>
      </div>

      <div className="w-full max-w-[1440px] mx-auto py-8 grid grid-cols-1 md:grid-cols-3 gap-2 mb-10">
        {/* Card 1 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col h-full">
          <h4 className="text-lg font-bold text-primary mb-2">
            Recrutamento e Seleção
          </h4>
          <p className="text-gray-700">
            Recrutamos e selecionamos os melhores talentos, sempre alinhados à
            cultura e necessidades do seu negócio. Nossa metodologia ágil reduz
            prazos e aumenta a assertividade desde posições operacionais a
            executivas.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col h-full">
          <h4 className="text-lg font-bold text-primary mb-2">
            Hunting e Mapeamento de Mercado
          </h4>
          <p className="text-gray-700">
            Combinamos busca ativa e abordagens por setor para identificar e
            atrair os melhores profissionais do mercado. Atuamos com sigilo,
            agilidade e assertividade para posições estratégicas ou nichos
            altamente especializados.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col h-full">
          <h4 className="text-lg font-bold text-primary mb-2">
            Avaliação de Perfil e Competências
          </h4>
          <p className="text-gray-700">
            Utilizamos ferramentas e testes consagrados para mapear habilidades
            técnicas, comportamentais e compatibilidade cultural, assegurando
            contratações alinhadas ao propósito da sua empresa.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col h-full">
          <h4 className="text-lg font-bold text-primary mb-2">
            Consultoria em R&S
          </h4>
          <p className="text-gray-700">
            Diagnóstico e estruturação, interna e externa, para todos os
            processos de Recrutamento & Seleção: desenho de cargos, definição de
            perfis, implantação de boas práticas, adaptação de processos,
            treinamento da equipe de RH e acompanhamento de indicadores de
            contratação e retenção.
          </p>
        </div>

        {/* Card 5 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col h-full">
          <h4 className="text-lg font-bold text-primary mb-2">
            Retenção de Talentos
          </h4>
          <p className="text-gray-700">
            Atuamos na construção de engajamento, otimização de jornada e
            fortalecimento do vínculo do colaborador, contribuindo com redução
            de turnover nos times estratégicos e operacionais.
          </p>
        </div>

        {/* Card 6 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col h-full">
          <h4 className="text-lg font-bold text-primary mb-2">
            Plataforma de Busca Ativa
          </h4>
          <p className="text-gray-700">
            Você tem acesso a um ambiente online com vagas e candidatos
            altamente qualificados do seu segmento, com integração de dados e
            validação ponto a ponto durante o processo.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center mb-10">
        <h3 className="text-2xl md:text-3xl text-primary font-bold mb-4 text-center">
          Nossa Missão
        </h3>
        <p className="md:text-lg text-gray-500 leading-relaxed max-w-[900px] text-justify">
          Superar as expectativas de nossos clientes e candidatos, oferecendo
          soluções de recrutamento e seleção personalizadas, ágeis e eficazes.
          Queremos ser reconhecidos como o parceiro estratégico que entende e
          antecipa as necessidades do mercado, impulsionando o crescimento de
          empresas e a realização profissional de indivíduos.
        </p>
      </div>

      <div className="mb-10">
        <h3 className="text-2xl md:text-3xl text-primary font-bold mb-4">
          Nossos Valores: A Essência da Nossa Singularidade
        </h3>

        <div className="flex  justify-center items-center gap-10 flex-wrap">
          <p className="md:text-lg max-w-[900px] text-justify text-[#545454]">
            Na Aura R&S Labs Ltda, acreditamos que o sucesso de qualquer
            organizaqdo estå diretamente ligado aos valores que a sustentam. Sdo
            esses principios que orientam nossas decisöes, moldam nossa cultura
            e definem como nos relacionamos com nossos clientes, parceiros,
            candidatos e com a sociedade. Nosso compromisso vai além de
            preencher vagas: buscamos gerar impacto positivo, criando conexöes
            estratégicas entre pessoas e oportunidades que transformam
            realidades. Para isso, norteamos todas as nossas aqöes pelos
            seguintes valores:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 sm:grid-cols-1 mb-10">
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
