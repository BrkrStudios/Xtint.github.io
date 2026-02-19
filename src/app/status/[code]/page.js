import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getJobByCode, getStatusLabel, getStatusColor } from '@/lib/sanity/queries'
import styles from '../status.module.css'
import RefreshButton from './RefreshButton'

export const revalidate = 60

export default async function JobStatusPage({ params }) {
  const { code } = await params
  const job = await getJobByCode(code)

  if (!job) {
    notFound()
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const statusColor = getStatusColor(job.status)

  // Determine which statuses to show based on needsTintRemoval checkbox
  const allStatuses = [
    'awaiting-dropoff',
    'received',
    'prepping',
    'tint-removal',
    'tinting',
    'curing',
    'ready',
    'completed',
  ]

  // Only show tint-removal if the job needs it
  const visibleStatuses = job.needsTintRemoval
    ? allStatuses
    : allStatuses.filter(s => s !== 'tint-removal')

  // Check if any documents are available
  const hasDocuments = job.documents && job.documents.length > 0

  // Calculate days remaining until expiration (30 days from creation)
  const createdDate = new Date(job._createdAt)
  const expirationDate = new Date(createdDate)
  expirationDate.setDate(expirationDate.getDate() + 30)
  const daysRemaining = Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <div className={styles.container}>
      <div className={styles.maxWidth}>
        <Link href="/status" className={styles.backLink}>
          <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Check Another Job
        </Link>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderTop}>
              <h1 className={styles.jobTitle}>{job.vehicle.make} {job.vehicle.model}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className={styles.statusBadge} style={{ background: statusColor }}>
                  {getStatusLabel(job.status)}
                </div>
                <RefreshButton />
              </div>
            </div>
            {job.lastUpdated && (
              <p className={styles.lastUpdated}>
                Last Status Update: {formatDate(job.lastUpdated)}
              </p>
            )}
          </div>

          <div className={styles.progressSection}>
            <h3 className={styles.progressTitle}>Progress</h3>

            {job.isDelayed && (
              <div className={styles.delayAlert}>
                <svg className={styles.delayIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className={styles.delayContent}>
                  <div className={styles.delayTitle}>Operations Delayed</div>
                  <div className={styles.delayText}>
                    {job.delayMessage || 'Current Progress Delayed. Operations will resume shortly.'}
                  </div>
                </div>
              </div>
            )}

            <div className={styles.progressList}>
              {visibleStatuses.map((status) => {
                // Use visible statuses for progress calculation
                const currentIndex = visibleStatuses.indexOf(job.status)
                const stepIndex = visibleStatuses.indexOf(status)
                const isCompleted = stepIndex <= currentIndex
                const isCurrent = status === job.status

                return (
                  <div key={status} className={styles.progressItem}>
                    <div
                      className={`${styles.progressDot} ${
                        isCurrent
                          ? styles.progressDotCurrent
                          : isCompleted
                          ? styles.progressDotCompleted
                          : styles.progressDotIncomplete
                      }`}
                    />
                    <span
                      className={`${styles.progressLabel} ${
                        isCurrent && status === 'completed'
                          ? styles.progressLabelFinished
                          : isCurrent
                          ? styles.progressLabelCurrent
                          : isCompleted
                          ? styles.progressLabelCompleted
                          : ''
                      }`}
                    >
                      {getStatusLabel(status)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className={styles.cardBody}>
            {job.code && (
              <div className={styles.detailSection}>
                <h3 className={styles.detailLabel}>JOB CODE</h3>
                <p className={styles.detailValue}>{job.code}</p>
              </div>
            )}

            {job.customerName && (
              <div className={styles.detailSection}>
                <h3 className={styles.detailLabel}>CUSTOMER</h3>
                <p className={styles.detailValue}>{job.customerName}</p>
              </div>
            )}

            {job.appointmentDate && (
              <div className={styles.detailSection}>
                <h3 className={styles.detailLabel}>Appointment</h3>
                <p className={styles.detailValue}>{formatDate(job.appointmentDate)}</p>
              </div>
            )}

            {job.notes && (
              <div className={styles.detailSection}>
                <h3 className={styles.detailLabel}>Notes</h3>
                <p className={styles.notes}>{job.notes}</p>
              </div>
            )}
          </div>

          {hasDocuments && (
            <div className={styles.documentsSection}>
              <h3 className={styles.documentsTitle}>Documents</h3>
              <div className={styles.documentsList}>
                {job.documents.map((doc) => (
                  <a
                    key={doc._key}
                    href={doc.file?.asset?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.documentLink}
                  >
                    <div className={styles.documentLinkContent}>
                      <svg className={styles.documentIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className={styles.documentLabel}>{doc.title}</span>
                    </div>
                    <svg className={styles.downloadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.helpBox} style={{ marginTop: '24px' }}>
          <p className={styles.helpText}>
            Have questions? Contact us at{' '}
            <a href="tel:+18327765717" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              (832) 776-5717
            </a>
          </p>
        </div>

        <div className={styles.expirationNotice}>
          <p className={styles.expirationText}>
            ⏱️ This tracking code will expire in 30 days from job creation
            {daysRemaining > 0 && ` (${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining)`}
          </p>
        </div>
      </div>
    </div>
  )
}
