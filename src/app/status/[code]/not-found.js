import Link from 'next/link'
import styles from '../status.module.css'

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <div className={styles.notFoundIcon}>🔍</div>
        <h1 className={styles.notFoundTitle}>Job Not Found</h1>
        <p className={styles.notFoundText}>
          We couldn't find a job with that code. Please check your code and try again.
        </p>

        <div className={styles.notFoundButtons}>
          <Link href="/status" className={`${styles.notFoundButton} ${styles.notFoundButtonPrimary}`}>
            Try Another Code
          </Link>

          <Link href="/" className={`${styles.notFoundButton} ${styles.notFoundButtonSecondary}`}>
            Back to Home
          </Link>
        </div>

        <div className={styles.helpBox} style={{ marginTop: '32px' }}>
          <p className={styles.helpText}>
            Need help? Contact us and we'll locate your job for you.
          </p>
        </div>
      </div>
    </div>
  )
}
