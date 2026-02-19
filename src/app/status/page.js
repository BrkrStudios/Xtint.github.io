'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './status.module.css'

export default function StatusLookupPage() {
  const [code, setCode] = useState('')
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (code.trim()) {
      router.push(`/status/${code.trim().toUpperCase()}`)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.maxWidth}>
        <div className={styles.header}>
          <h1 className={styles.title}>Track Your Job Status</h1>
          <p className={styles.subtitle}>
            Enter your job code to check the current status of your tinting job
          </p>
        </div>

        <div className={styles.form}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="code" className={styles.label}>
                Job Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter your 8-character code"
                maxLength={8}
                className={styles.input}
                required
              />
              <p className={styles.hint}>Example: ABC12345</p>
            </div>

            <button
              type="submit"
              disabled={code.trim().length === 0}
              className={styles.button}
            >
              Check Status
            </button>
          </form>

          <div className={styles.helpBox}>
            <h3 className={styles.helpTitle}>Need Help?</h3>
            <p className={styles.helpText}>
              Your job code can be found on your receipt or in the confirmation message we sent you.
              If you can't find it, please contact us.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
