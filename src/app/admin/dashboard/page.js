'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkSession, clearSession } from '@/lib/auth';
import styles from '../admin.module.css';

export default function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!checkSession()) {
      router.replace('/admin');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.replace('/admin');
  };

  if (!authorized) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Verifying access...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardInner}>
        <div className={styles.dashboardHeader}>
          <div className={styles.dashboardBrand}>
            <img src="/images/logo1.png" alt="XTINT" className={styles.dashboardLogo} />
            <span className={styles.dashboardLabel}>Admin Panel</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>

        <h1 className={styles.dashboardTitle}>Dashboard</h1>
        <p className={styles.dashboardSubtitle}>Admin Tools</p>

        <div className={styles.toolsGrid}>
          <a href="/admin/quote-generator" className={styles.toolCard}>
            <div className={styles.toolInfo}>
              <span className={styles.toolName}>Quote & Invoice Maker</span>
              <span className={styles.toolDescription}>Create quotes and invoices for automotive & residential jobs</span>
            </div>
            <span className={styles.toolArrow}>&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
