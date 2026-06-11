import { Linkedin, Instagram, Youtube } from 'lucide-react';
import styles from './Footer.module.css';

const NAV_COLS = [
  {
    title: 'Produto',
    links: [
      { label: 'Recursos', href: '#recursos' },
      { label: 'Dashboard', href: '#dashboard' },
      { label: 'IA', href: '#' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre', href: '#' },
      { label: 'Contato', href: '#' },
      { label: 'Carreiras', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Política de Privacidade', href: '#' },
      { label: 'Termos de Uso', href: '#' },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: null, label: 'Twitter / X', href: '#' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand column */}
          <div className={styles.colLogo}>
            <div className={styles.logo}>
              Race<span className={styles.logoAccent}>Engineer</span>
            </div>
            <p className={styles.description}>
              Seu engenheiro de corrida movido por IA. Análise de telemetria,
              estratégia e performance para pilotos de todos os níveis.
            </p>
            <div className={styles.socialRow}>
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className={styles.socialLink}
                  aria-label={label}
                >
                  {Icon ? (
                    <Icon size={16} />
                  ) : (
                    /* X (Twitter) logo */
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632 5.904-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map((col) => (
            <div key={col.title}>
              <h4 className={styles.colTitle}>{col.title}</h4>
              <ul className={styles.colLinks}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()}{' '}
            <span className={styles.copyrightAccent}>Race Engineer</span>. Todos os direitos reservados.
          </p>
          <div className={styles.legalLinks}>
            <a href="#">Política de Privacidade</a>
            <a href="#">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
