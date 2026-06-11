import styles from './AISection.module.css';

const FEATURES = [
  'Detecta padrões de frenagem subótimos em tempo real',
  'Compara com as referências dos melhores pilotos',
  'Gera recomendações acionáveis e mensuráveis',
  'Aprende com seu histórico de sessões',
];

export default function AISection() {
  return (
    <section className={styles.section}>
      <div className={styles.redGlow} />

      <div className={styles.container}>
        {/* Left Column */}
        <div>
          <span className={styles.eyebrow}>Inteligência Artificial</span>
          <h2 className={styles.title}>
            A inteligência artificial encontra o que seus olhos não veem.
          </h2>
          <p className={styles.description}>
            Nosso motor de IA analisa cada ponto de dados da sua sessão, comparando com
            padrões ótimos e identificando exatamente onde décimos preciosos estão sendo
            perdidos — setor por setor, curva por curva.
          </p>
          <ul className={styles.featureList}>
            {FEATURES.map((feature) => (
              <li key={feature} className={styles.featureItem}>
                <div className={styles.featureCheck}>✓</div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column — AI Panel */}
        <div className={styles.aiPanel}>
          <div className={styles.aiPanelHeader}>
            <span className={styles.aiPanelHeaderIcon}>🤖</span>
            <span className={styles.aiPanelHeaderTitle}>Análise de IA — Sessão Atual</span>
            <span className={styles.aiPanelHeaderBadge}>Novo</span>
          </div>

          <div className={styles.aiPanelBody}>
            <div className={styles.aiInsight}>
              <p className={styles.insightText}>
                Você está freando{' '}
                <span className={styles.insightHighlight}>8 metros antes do ideal</span>{' '}
                na Curva 4. Isso está custando tempo na saída da curva.
              </p>

              <div className={styles.insightMeta}>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Impacto estimado</span>
                  <span className={styles.metaValuePositive}>+0.18s por volta</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Curvas afetadas</span>
                  <span className={styles.metaValue}>Curva 4, Curva 7</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Ocorrências</span>
                  <span className={styles.metaValue}>12 de 15 voltas</span>
                </div>
              </div>

              <div className={styles.confidenceBar}>
                <div className={styles.confidenceHeader}>
                  <span className={styles.confidenceLabel}>Confiança da análise</span>
                  <span className={styles.confidenceValue}>96%</span>
                </div>
                <div className={styles.confidenceTrack}>
                  <div className={styles.confidenceFill} style={{ width: '96%' }} />
                </div>
              </div>

              <button className={styles.applyBtn}>
                Aplicar recomendação
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
