import './globals.css';

export const metadata = {
  title: 'Race Engineer — IA para Performance em Corridas',
  description:
    'Seu engenheiro de corrida movido por IA. Analise telemetria, otimize estratégias e descubra onde ganhar décimos preciosos em cada volta.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
