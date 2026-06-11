import Link from 'next/link';
import styles from './CTABanner.module.css';

export default function CTABanner() {
  return (
    <section className={styles.section}>
      <div className={styles.overlay} />
      <div className={styles.gridOverlay} />

      <div className={styles.speedLines}>
        <svg viewBox="0 0 1440 500" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1={-200 + i * 140}
              y1="0"
              x2={200 + i * 140}
              y2="500"
              stroke="white"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>

      <div className={styles.content}>
        <h2 className={styles.headline}>
          Cada <span className={styles.headlineAccent}>décimo</span> importa.
        </h2>
        <p className={styles.subheadline}>
          Comece hoje e descubra onde está seu próximo ganho de performance.
          Análise profissional ao alcance de todo piloto.
        </p>
        <div>
          <Link href="/login" className={styles.btn}>
            Começar Teste Gratuito
          </Link>
          <span className={styles.smallNote}>Sem cartão de crédito. Cancele quando quiser.</span>
        </div>
      </div>
    </section>
  );
}
