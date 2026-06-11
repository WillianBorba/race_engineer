import styles from './Testimonials.module.css';

const TESTIMONIALS = [
  {
    quote: 'Ganhei quase 1 segundo por volta após utilizar o Race Engineer. A análise de frenagem identificou exatamente onde eu estava errando.',
    name: 'Rafael Monteiro',
    role: 'Piloto GT4 — ACC',
    initials: 'RM',
    avatarColor: '#E10600',
  },
  {
    quote: 'A análise de telemetria economizou horas de trabalho. O que levava uma tarde inteira agora fica pronto em minutos.',
    name: 'Claudia Ferreira',
    role: 'Engenheiro de Performance',
    initials: 'CF',
    avatarColor: '#3b82f6',
  },
  {
    quote: 'Finalmente entendi onde estava errando. As recomendações são precisas e acionáveis — não apenas dados brutos.',
    name: 'Lucas Pinheiro',
    role: 'Simracer Competitivo',
    initials: 'LP',
    avatarColor: '#22c55e',
  },
];

export default function Testimonials() {
  return (
    <section className={styles.section} id="depoimentos">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Depoimentos</span>
          <h2 className={styles.title}>Resultados na pista.</h2>
        </div>

        <div className={styles.grid}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className={styles.card}>
              <div className={styles.stars}>
                {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
              </div>

              <p className={styles.quote}>
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className={styles.author}>
                <div
                  className={styles.avatar}
                  style={{ background: `${t.avatarColor}22`, border: `1px solid ${t.avatarColor}44` }}
                >
                  <span style={{ color: t.avatarColor }}>{t.initials}</span>
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{t.name}</span>
                  <span className={styles.authorRole}>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
