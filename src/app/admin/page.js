'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyCode, setSession } from '@/lib/auth';
import styles from './admin.module.css';

export default function AdminLogin() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const valid = await verifyCode(code);

    if (valid) {
      setSession();
      router.push('/admin/dashboard');
    } else {
      setError('Invalid access code');
      setCode('');
    }

    setLoading(false);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <img src="/images/logo1.png" alt="XTINT" className={styles.loginLogo} />
          <h1 className={styles.loginTitle}>ADMIN ACCESS</h1>
          <p className={styles.loginSubtitle}>Enter your access code to continue</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputWrapper}>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter access code"
              className={styles.codeInput}
              autoFocus
              autoComplete="off"
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading || !code}
          >
            {loading ? 'VERIFYING...' : 'ENTER'}
          </button>
        </form>

        <a href="/" className={styles.backLink}>Back to Site</a>
      </div>
    </div>
  );
}
