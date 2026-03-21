import Link from 'next/link'
import styles from './terms.module.css'

export const metadata = {
  title: 'Terms and Conditions | XTintUSA',
  description: 'Terms and Conditions for XTintUSA LLC - terms of service for our website and SMS notifications.',
}

export default function TermsPage() {
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
          <h1 className={styles.title}>Terms and Conditions</h1>
          <p className={styles.subtitle}>Last updated: March 21, 2026</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Agreement to Terms</h2>
            <p className={styles.text}>
              By accessing or using the XTintUSA website (xtintusa.com) and services, you agree to be
              bound by these Terms and Conditions. If you do not agree with any part of these terms,
              please do not use our website or services.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Services</h2>
            <p className={styles.text}>
              XTintUSA LLC (&quot;XTintUSA,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) provides automotive window tinting
              services at our location: 6510 Bourgeois Rd #32, Houston, TX 77066. Our website allows
              customers to track the status of their tinting jobs and receive related information.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>SMS Notifications Program</h2>
            <p className={styles.text}>
              XTintUSA offers an SMS notification program to keep you updated on the status of your
              tinting job. By providing your phone number when booking a job, you consent to the
              following:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.listLabel}>Program Name:</span> XTintUSA Job Status Notifications
              </li>
              <li className={styles.listItem}>
                <span className={styles.listLabel}>Message Frequency:</span> Varies based on job status changes, typically 3-6 messages per job
              </li>
              <li className={styles.listItem}>
                <span className={styles.listLabel}>Message Content:</span> Automated updates about your vehicle&apos;s tinting status (received, prepping, tinting, curing, ready for pickup, completed)
              </li>
              <li className={styles.listItem}>
                <span className={styles.listLabel}>Message and Data Rates:</span> Standard message and data rates from your wireless carrier may apply
              </li>
              <li className={styles.listItem}>
                <span className={styles.listLabel}>Opt-Out:</span> Reply <strong>STOP</strong> to any message to stop receiving notifications
              </li>
              <li className={styles.listItem}>
                <span className={styles.listLabel}>Help:</span> Reply <strong>HELP</strong> for assistance, or call us at (832) 776-5717
              </li>
            </ul>
            <p className={styles.text}>
              You may opt out of SMS notifications at any time without affecting the tinting services
              you have booked. Opting out means you will need to check your job status manually via
              the status page on our website.
            </p>
            <p className={styles.text}>
              SMS notifications are not available on all carriers. Compatible carriers include but are
              not limited to AT&T, T-Mobile, Verizon, and Sprint. XTintUSA is not responsible for
              delayed or undelivered messages due to carrier issues.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Job Status and Estimated Times</h2>
            <p className={styles.text}>
              Estimated ready times provided via SMS or on the status page are approximate and subject
              to change. XTintUSA is not liable for delays caused by unforeseen circumstances,
              including but not limited to material availability, weather conditions, or vehicle-specific
              complications.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Website Use</h2>
            <p className={styles.text}>You agree to use the XTintUSA website only for lawful purposes. You may not:</p>
            <ul className={styles.list}>
              <li className={styles.listItem}>Attempt to access job status information for vehicles that are not yours.</li>
              <li className={styles.listItem}>Use automated tools to scrape, crawl, or extract data from the website.</li>
              <li className={styles.listItem}>Interfere with or disrupt the website&apos;s operation or security.</li>
              <li className={styles.listItem}>Use the website to transmit harmful or malicious content.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Intellectual Property</h2>
            <p className={styles.text}>
              All content on the XTintUSA website, including text, graphics, logos, and design, is the
              property of XTintUSA LLC and is protected by applicable intellectual property laws. You
              may not reproduce, distribute, or create derivative works without our prior written consent.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
            <p className={styles.text}>
              XTintUSA LLC provides the website and SMS notifications on an &quot;as is&quot; basis. We make no
              warranties, expressed or implied, regarding the accuracy, reliability, or availability of
              the website or SMS services.
            </p>
            <p className={styles.text}>
              To the maximum extent permitted by law, XTintUSA LLC shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of the website or
              SMS notification services.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Privacy</h2>
            <p className={styles.text}>
              Your use of our services is also governed by our{' '}
              <Link href="/privacy" className={styles.link}>Privacy Policy</Link>, which describes
              how we collect, use, and protect your personal information.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Governing Law</h2>
            <p className={styles.text}>
              These terms are governed by and construed in accordance with the laws of the State of
              Texas, without regard to its conflict of law principles. Any disputes arising from these
              terms shall be resolved in the courts located in Harris County, Texas.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Changes to These Terms</h2>
            <p className={styles.text}>
              We reserve the right to update these Terms and Conditions at any time. Changes will be
              posted on this page with an updated revision date. Your continued use of our website and
              services after any changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Us</h2>
            <p className={styles.text}>
              If you have any questions about these Terms and Conditions, please contact us:
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
