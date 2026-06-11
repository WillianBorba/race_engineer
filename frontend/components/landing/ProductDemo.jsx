import styles from './ProductDemo.module.css';

const TELEMETRY_BARS = [
  { label: 'Freio', value: 23, color: '#E10600', display: '23%' },
  { label: 'Acelerador', value: 78, color: '#22c55e', display: '78%' },
  { label: 'RPM', value: 88, color: '#f59e0b', display: '8.4k' },
  { label: 'Marcha', value: 60, color: '#3b82f6', display: '5ª' },
];

const SIDEBAR_ITEMS = [
  { label: 'Overview', active: false },
  { label: 'Telemetria', active: true },
  { label: 'Setup', active: false },
  { label: 'Estratégia', active: false },
  { label: 'Histórico', active: false },
];

export default function ProductDemo() {
  return (
    <section className={styles.section} id="dashboard">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Dashboard</span>
          <h2 className={styles.title}>Tudo que um engenheiro de corrida precisa.</h2>
        </div>

        <div className={styles.appShellWrapper}>
          <div className={styles.appShell}>
            {/* Window chrome */}
            <div className={styles.windowBar}>
              <div className={styles.windowDots}>
                <div className={`${styles.dot} ${styles.dotRed}`} />
                <div className={`${styles.dot} ${styles.dotYellow}`} />
                <div className={`${styles.dot} ${styles.dotGreen}`} />
              </div>
              <span className={styles.windowTitle}>Race Engineer — Telemetria</span>
            </div>
            <div className={styles.layout}>
              {/* Sidebar */}
              <aside className={styles.sidebar}>
                <div className={styles.sidebarTitle}>Race Engineer</div>
                <ul className={styles.sidebarNav}>
                  {SIDEBAR_ITEMS.map((item) => (
                    <li
                      key={item.label}
                      className={`${styles.sidebarItem} ${item.active ? styles.active : ''}`}
                    >
                      <div className={styles.sidebarDot} />
                      {item.label}
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Main Content */}
              <main className={styles.mainContent}>
                <div className={styles.contentGrid}>
                  {/* Delta Time Chart */}
                  <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                      <span className={styles.chartTitle}>Delta Time — Últimas 10 Voltas</span>
                      <div className={styles.chartLegend}>
                        <div className={styles.legendItem}>
                          <div className={styles.legendDot} style={{ background: '#E10600' }} />
                          Você
                        </div>
                        <div className={styles.legendItem}>
                          <div className={styles.legendDot} style={{ background: '#3b82f6' }} />
                          Ref.
                        </div>
                      </div>
                    </div>
                    <div className={styles.deltaChart}>
                      <svg viewBox="0 0 600 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        {/* Grid lines */}
                        <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        <line x1="0" y1="20" x2="600" y2="20" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="0" y1="60" x2="600" y2="60" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />

                        {/* Your line */}
                        <polyline
                          points="0,45 60,38 120,42 180,35 240,30 300,36 360,28 420,33 480,25 540,29 600,24"
                          stroke="#E10600"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                        {/* Reference line */}
                        <polyline
                          points="0,40 60,40 120,40 180,40 240,40 300,40 360,40 420,40 480,40 540,40 600,40"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="6 3"
                        />

                        {/* Dots on your line */}
                        {[
                          [0,45],[60,38],[120,42],[180,35],[240,30],[300,36],[360,28],[420,33],[480,25],[540,29],[600,24]
                        ].map(([x, y], i) => (
                          <circle key={i} cx={x} cy={y} r="3" fill="#E10600" />
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Telemetry bars */}
                  <div className={styles.telemetryGrid}>
                    {TELEMETRY_BARS.map((bar) => (
                      <div key={bar.label} className={styles.telemetryCard}>
                        <div className={styles.telemetryCardLabel}>{bar.label}</div>
                        <div className={styles.telemetryBarTrack}>
                          <div
                            className={styles.telemetryBar}
                            style={{ width: `${bar.value}%`, background: bar.color }}
                          />
                        </div>
                        <div className={styles.telemetryCardValue}>{bar.display}</div>
                      </div>
                    ))}
                  </div>

                  {/* Heatmap + Comparison */}
                  <div className={styles.comparisonRow}>
                    <div className={styles.compCard}>
                      <div className={styles.compCardTitle}>Setor por Volta — Heatmap</div>
                      <div className={styles.sectorLabel}>Volta 12</div>
                      <div className={styles.sectorHeatmap}>
                        <div className={styles.sector} style={{ background: 'rgba(34,197,94,0.25)', color: '#22c55e' }}>S1 +0.12</div>
                        <div className={styles.sector} style={{ background: 'rgba(225,6,0,0.2)', color: '#E10600' }}>S2 -0.08</div>
                        <div className={styles.sector} style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>S3 +0.05</div>
                      </div>
                    </div>

                    <div className={styles.compCard}>
                      <div className={styles.compCardTitle}>Comparação de Pilotos</div>
                      <div className={styles.compItem}>
                        <span className={styles.compLabel}>Piloto A</span>
                        <span className={styles.compValue}>1:22.845</span>
                      </div>
                      <div className={styles.compItem}>
                        <span className={styles.compLabel}>Piloto B</span>
                        <span className={styles.compValue}>1:23.131</span>
                      </div>
                      <div className={styles.compItem}>
                        <span className={styles.compLabel}>Diferença</span>
                        <span className={styles.compValueDiff}>+0.286s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
