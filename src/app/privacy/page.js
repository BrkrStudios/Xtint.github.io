import Link from 'next/link'
import styles from './privacy.module.css'

export const metadata = {
  title: 'Privacy Policy | XTintUSA',
  description: 'Privacy Policy for XTintUSA LLC - how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.maxWidth}>
        <Link href="/" className={styles.backLink}>
          <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>Last updated: March 21, 2026</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Who We Are</h2>
            <p className={styles.text}>
              XTintUSA LLC (&quot;XTintUSA,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website
              xtintusa.com and provides automotive window tinting services. Our business is located at
              6510 Bourgeois Rd #32, Houston, TX 77066.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Information We Collect</h2>
            <p className={styles.text}>We collect the following personal information when you book a tinting job or interact with our services:</p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.listLabel}>Name</span> - to identify you and your vehicle during the tinting process.
              </li>
              <li className={styles.listItem}>
                <span className={styles.listLabel}>Phone number</span> - to send you automated SMS status updates about your job.
              </li>
              <li className={styles.listItem}>
                <span className={styles.listLabel}>Vehicle information</span> - including make, model, year, and type, to perform tinting services and reference in status updates.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
            <p className={styles.text}>Your personal information is used solely for the following purposes:</p>
            <ul className={styles.list}>
              <li className={styles.listItem}>To perform and manage your window tinting job.</li>
              <li className={styles.listItem}>To send automated SMS notifications about the status of your vehicle (received, prepping, tinting, curing, ready for pickup, completed).</li>
              <li className={styles.listItem}>To provide you with a unique job status page where you can track your vehicle&apos;s progress.</li>
              <li className={styles.listItem}>To contact you regarding your job if needed.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>SMS Messaging</h2>
            <p className={styles.text}>
              By providing your phone number when booking a tinting job, you consent to receive automated
              SMS messages regarding your job status. Message frequency varies based on the number of
              status changes during your job (typically 3-6 messages per job). Message and data rates may apply.
            </p>
            <p className={styles.text}>
              You may opt out of SMS notifications at any time by replying <strong>STOP</strong> to any
              message. Reply <strong>HELP</strong> for assistance. For support, contact us at (832) 776-5717.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Data Sharing</h2>
            <p className={styles.text}>
              We do not sell, trade, or share your personal information with third parties for marketing
              purposes. Your information may be shared only with the following service providers who
              assist us in operating our business:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.listLabel}>Twilio</span> - our SMS messaging provider, which processes your phone number to deliver status notifications.
              </li>
            </ul>
            <p className={styles.text}>
              These providers are contractually obligated to use your information only for the purposes
              of providing services to us and are required to protect your data.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Data Retention</h2>
            <p className={styles.text}>
              We retain your personal information only for as long as necessary to fulfill the purposes
              described in this policy. Job records, including your name, phone number, and vehicle
              information, are retained for warranty and business record purposes. You may request
              deletion of your data at any time by contacting us.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Cookies and Tracking</h2>
            <p className={styles.text}>
              Our website does not use cookies or tracking technologies for analytics or advertising
              purposes. We do not use Google Analytics or similar tracking services.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Data Security</h2>
            <p className={styles.text}>
              We take reasonable measures to protect your personal information from unauthorized access,
              disclosure, alteration, and destruction. However, no method of transmission over the
              internet or electronic storage is 100% secure.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Rights</h2>
            <p className={styles.text}>You have the right to:</p>
            <ul className={styles.list}>
              <li className={styles.listItem}>Request access to the personal information we hold about you.</li>
              <li className={styles.listItem}>Request correction of inaccurate information.</li>
              <li className={styles.listItem}>Request deletion of your personal information.</li>
              <li className={styles.listItem}>Opt out of SMS notifications at any time by replying STOP.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Changes to This Policy</h2>
            <p className={styles.text}>
              We may update this privacy policy from time to time. Any changes will be posted on this
              page with an updated revision date. Your continued use of our services after any changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Us</h2>
            <p className={styles.text}>
              If you have any questions about this privacy policy or our data practices, please contact us:
            </p>
            <div className={styles.contactBox}>
              <p className={styles.contactText}>XTintUSA LLC</p>
              <p className={styles.contactText}>6510 Bourgeois Rd #32, Houston, TX 77066</p>
              <p className={styles.contactText}>Phone: (832) 776-5717</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
