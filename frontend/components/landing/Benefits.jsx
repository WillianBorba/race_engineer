import styles from './Benefits.module.css';

const FEATURES = [
  {
    icon: '📈',
    title: 'Análise de Telemetria',
    description: 'Entenda exatamente onde você ganha ou perde tempo em cada setor da pista.',
  },
  {
    icon: '⚙️',
    title: 'Sugestões de Setup',
    description: 'Recomendações inteligentes de configuração do carro para cada circuito e condição.',
  },
  {
    icon: '🏎️',
    title: 'Estratégia de Corrida',
    description: 'Pit stops, gestão de pneus e combustível calculados com precisão.',
  },
  {
    icon: '🔄',
    title: 'Comparação de Voltas',
    description: 'Compare voltas rápidas lado a lado e identifique onde ganhar tempo.',
  },
  {
    icon: '⚡',
    title: 'Insights em Tempo Real',
    description: 'Receba feedback instantâneo durante a sessão para ajustes imediatos.',
  },
  {
    icon: '📚',
    title: 'Histórico de Performance',
    description: 'Acompanhe sua evolução ao longo do tempo com dados organizados e acessíveis.',
  },
];

export default function Benefits() {
  return (
    <section className={styles.section} id="recursos">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Recursos</span>
          <h2 className={styles.title}>Transforme dados em desempenho.</h2>
        </div>

        <div className={styles.grid}>
          {FEATURES.map((feature) => (
            <div key={feature.title} className={styles.card}>
              <span className={styles.cardIcon}>{feature.icon}</span>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
