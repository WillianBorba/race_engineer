'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className={styles.navbar} role="navigation" aria-label="Navegação principal">
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>
            Race<span className={styles.logoAccent}>Engineer</span>
          </Link>

          <ul className={styles.navLinks}>
            <li><a href="#recursos">Recursos</a></li>
            <li><a href="#como-funciona">Como Funciona</a></li>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#depoimentos">Depoimentos</a></li>
          </ul>

          <div className={styles.actions}>
            <Link href="/login" className={styles.btnGhost}>
              Entrar
            </Link>
            <Link href="/login" className={styles.btnPrimary}>
              Começar Agora
            </Link>
          </div>

          <button
            className={styles.hamburger}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
        <ul className={styles.mobileNavLinks}>
          <li><a href="#recursos" onClick={() => setIsOpen(false)}>Recursos</a></li>
          <li><a href="#como-funciona" onClick={() => setIsOpen(false)}>Como Funciona</a></li>
          <li><a href="#dashboard" onClick={() => setIsOpen(false)}>Dashboard</a></li>
          <li><a href="#depoimentos" onClick={() => setIsOpen(false)}>Depoimentos</a></li>
        </ul>
        <div className={styles.mobileActions}>
          <Link href="/login" className={styles.btnGhost} onClick={() => setIsOpen(false)}>
            Entrar
          </Link>
          <Link href="/login" className={styles.btnPrimary} onClick={() => setIsOpen(false)}>
            Começar Agora
          </Link>
        </div>
      </div>
    </>
  );
}
