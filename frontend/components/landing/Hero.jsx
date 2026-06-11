import Link from 'next/link';
import styles from './Hero.module.css';

const TELEMETRY_DATA = [
  { label: 'Throttle', value: 87, color: '#22c55e', display: '87%' },
  { label: 'Brake', value: 12, color: '#E10600', display: '12%' },
  { label: 'Steering', value: 64, color: '#3b82f6', display: '64%' },
  { label: 'RPM', value: 92, color: '#f59e0b', display: '8.4k' },
];

const KPI_DATA = [
  { label: 'Tempo de Volta', value: '1:22.845', type: 'normal' },
  { label: 'Delta', value: '-0.321s', type: 'positive' },
  { label: 'Vel. Máxima', value: '286 km/h', type: 'normal' },
  { label: 'Consistência', value: '92%', type: 'normal' },
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.gridOverlay} />

      <div className={styles.circuitLines}>
        <svg viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <path
            d="M 100 700 L 100 200 Q 100 100 200 100 L 600 100 Q 700 100 700 200 L 700 350 Q 700 450 800 450 L 1100 450 Q 1200 450 1200 350 L 1200 150 Q 1200 50 1300 50 L 1440 50"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 4"
          />
          <path
            d="M 0 600 L 300 600 Q 400 600 400 500 L 400 350 Q 400 250 500 250 L 900 250 Q 1000 250 1000 350 L 1000 550 Q 1000 650 1100 650 L 1440 650"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="4 6"
          />
        </svg>
      </div>

      <div className={styles.redGlow} />

      <div className={styles.container}>
        <div className={styles.leftCol}>
          <div className={styles.badge}>
            <span className={styles.badgeAccent}>🏁</span>
            IA para Performance em Corridas
          </div>

          <h1 className={styles.headline}>
            Seu engenheiro de corrida<br />
            <span className={styles.headlineAccent}>movido por IA.</span>
          </h1>

          <p className={styles.subheadline}>
            Analise telemetria, otimize estratégias e descubra onde ganhar
            décimos preciosos em cada volta.
          </p>

          <div className={styles.ctaRow}>
            <Link href="/login" className={styles.btnPrimary}>
              Começar Agora
            </Link>
            <a href="#dashboard" className={styles.btnGhost}>
              Ver Demonstração
            </a>
          </div>

          <div className={styles.metrics}>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>95%</span>
              <span className={styles.metricLabel}>Precisão das análises</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>+0.7s</span>
              <span className={styles.metricLabel}>Melhoria média por volta</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>100%</span>
              <span className={styles.metricLabel}>Baseado em dados reais</span>
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.mockDashboard}>
            <div className={styles.dashHeader}>
              <div className={styles.dashHeaderLeft}>
                <div className={styles.dashDot} />
                <span className={styles.dashTitle}>Sessão Atual — ACC</span>
              </div>
              <span className={styles.dashLive}>LIVE</span>
            </div>

            <div className={styles.dashBody}>
              {/* Telemetry Bars */}
              <div className={styles.telemetryChart}>
                {TELEMETRY_DATA.map((item) => (
                  <div key={item.label} className={styles.telemetryRow}>
                    <span className={styles.telemetryLabel}>{item.label}</span>
                    <div className={styles.telemetryBarTrack}>
                      <div
                        className={styles.telemetryBar}
                        style={{ width: `${item.value}%`, background: item.color }}
                      />
                    </div>
                    <span className={styles.telemetryValue}>{item.display}</span>
                  </div>
                ))}
              </div>

              {/* Circuit Map + KPIs */}
              <div className={styles.circuitSection}>
                <div className={styles.circuitMap}>
                  <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M 20 80 L 20 30 Q 20 15 35 15 L 70 15 Q 85 15 85 30 L 85 45 Q 85 55 95 55 L 105 55 Q 115 55 115 65 L 115 80 Q 115 90 105 90 L 30 90 Q 20 90 20 80 Z"
                      stroke="rgba(225,6,0,0.7)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle cx="35" cy="90" r="3" fill="#E10600" />
                    <path
                      d="M 35 90 L 35 80"
                      stroke="#E10600"
                      strokeWidth="2"
                      strokeDasharray="2 2"
                    />
                    <text x="38" y="83" fontFamily="monospace" fontSize="8" fill="rgba(255,255,255,0.5)">S1</text>
                    <text x="76" y="25" fontFamily="monospace" fontSize="8" fill="rgba(255,255,255,0.5)">S2</text>
                    <text x="98" y="62" fontFamily="monospace" fontSize="8" fill="rgba(255,255,255,0.5)">S3</text>
                  </svg>
                </div>

                <div className={styles.kpiGrid}>
                  {KPI_DATA.map((kpi) => (
                    <div key={kpi.label} className={styles.kpiCard}>
                      <div className={styles.kpiLabel}>{kpi.label}</div>
                      <div
                        className={
                          kpi.type === 'positive'
                            ? styles.kpiValuePositive
                            : kpi.type === 'negative'
                            ? styles.kpiValueNegative
                            : styles.kpiValue
                        }
                      >
                        {kpi.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
