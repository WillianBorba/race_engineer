'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';
  const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ocorreu um erro. Tente novamente.');
        return;
      }

      router.push('/chat');
    } catch {
      setError('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setMode(isLogin ? 'register' : 'login');
    setError('');
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          Race<span className={styles.logoAccent}>Engineer</span>
        </div>

        <h1 className={styles.title}>
          {isLogin ? 'Entrar na sua conta' : 'Criar conta'}
        </h1>
        <p className={styles.subtitle}>
          {isLogin
            ? 'Acesse seu painel de engenharia'
            : 'Comece sua jornada como engenheiro virtual'}
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              className={styles.input}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <p className={styles.errorMsg} role="alert">{error}</p>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading
              ? 'Aguarde...'
              : isLogin
              ? 'Entrar'
              : 'Criar conta'}
          </button>
        </form>

        <p className={styles.switchMode}>
          {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
          <button
            type="button"
            className={styles.switchLink}
            onClick={toggleMode}
          >
            {isLogin ? 'Criar conta' : 'Entrar'}
          </button>
        </p>
      </div>
    </main>
  );
}
