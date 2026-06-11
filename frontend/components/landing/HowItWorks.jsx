import { Fragment } from 'react';
import styles from './HowItWorks.module.css';

const STEPS = [
  {
    number: '01',
    icon: '📂',
    title: 'Conecte seus dados',
    description: 'Importe dados de simuladores como ACC ou sistemas reais de telemetria.',
  },
  {
    number: '02',
    icon: '📊',
    title: 'Analise sua performance',
    description: 'Visualize métricas avançadas, comparações de voltas e padrões de condução.',
  },
  {
    number: '03',
    icon: '🤖',
    title: 'Receba recomendações inteligentes',
    description: 'A plataforma identifica oportunidades de melhoria e sugere ajustes precisos.',
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section} id="como-funciona">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Como Funciona</span>
          <h2 className={styles.title}>Três passos para correr mais rápido.</h2>
        </div>

        <div className={styles.stepsRow}>
          {STEPS.map((step, idx) => (
            <Fragment key={step.number}>
              <div className={styles.step}>
                <div className={styles.stepNumberWrap}>
                  <div className={styles.stepNumberBg}>
                    <span className={styles.stepNumber}>{step.number}</span>
                  </div>
                  <div className={styles.stepIconWrap}>
                    {step.icon}
                  </div>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>

              {idx < STEPS.length - 1 && (
                <div className={styles.stepConnector}>
                  <div className={styles.connectorLine} />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
