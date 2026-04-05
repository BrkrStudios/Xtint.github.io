import Link from 'next/link'
import styles from '../terms/terms.module.css'

export const metadata = {
  title: 'Policy Information | XTINTUSA LLC',
  description: 'Terms of Use, Terms and Conditions, and Privacy Policy for XTINTUSA LLC.',
}

export default function PolicyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.maxWidth}>
        <Link href="/" className={styles.backLink}>
          <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* ── TERMS OF USE ── */}
        <div className={styles.header} id="terms-of-use">
          <h1 className={styles.title}>Terms Of Use &amp; Privacy Policy</h1>
          <p className={styles.subtitle}>Last updated: April 4, 2026</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <p className={styles.text}>
              This document describes the XTINTUSA LLC policy regarding personal information, site
              security, communication, and site usage of xtintusa.com and all other sites operated by
              XTINTUSA LLC.
            </p>
            <p className={styles.text}>
              Use of the website signifies your agreement to the terms and conditions of use set forth
              in this document. If you do not agree to these terms, you may not access or otherwise use
              this website.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Collection of Personal Information</h2>
            <p className={styles.text}>
              We at XTINTUSA LLC respect your privacy. On occasion, we ask for personal data collected
              directly from you on this website, which may include first and last name, address, email
              address, and phone number. This may be collected through a submission form, during
              registration, while making a reservation, or when contacting us with questions. The
              information is used to fulfill requests such as sending information by mail, to use special
              features of the site, or to contact you regarding your request. By voluntarily providing
              personal information, you are consenting to the collection and use of your personal
              information in accordance with the terms of this Privacy Policy.
            </p>
            <p className={styles.text}>
              You may choose not to use any service that requires the use of your personal information
              in a manner not described in this Privacy Policy. Your use of XTINTUSA LLC, or any other
              XTINTUSA LLC online services will be considered as your consent to the use of your personal
              information in the way described.
            </p>
            <p className={styles.text}>
              As a matter of policy, your email address and phone number will not be sold, rented, or
              shared with any other business or organization. Users that have opted to receive
              communications from us may, from time to time, receive updates about new website features,
              services, and other information related to XTINTUSA LLC. If you wish to be removed from
              our newsletter lists, click on the unsubscribe link. If you provide your phone number, you
              agree to receive SMS from XTINTUSA LLC regarding your contact submission and can
              unsubscribe at any time by replying &quot;STOP.&quot;
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Information Collected from Your Device</h2>
            <p className={styles.text}>
              Our website may use technologies such as cookies, web beacons, pixels, and other similar
              technologies to automatically collect certain information from your device including, for
              example, your IP address, date and time of your visit, browser and operating system
              information, referring website address, and other information about how you interact with
              the website. Our website may also use cookies and similar technologies to enhance your user
              experience and enable certain features.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Information Collected from Our Partners</h2>
            <p className={styles.text}>
              We may collect personal information about you from our third-party partners and combine it
              with other information that we collect. Personal information we collect from our partners
              may include, for example, your demographic information and geographic location.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Security of Personal Information</h2>
            <p className={styles.text}>
              We exercise reasonable care to protect your non-public personal information.
              Unfortunately, no data transmission over the internet can be guaranteed to be one hundred
              percent secure. So, while we strive to protect your non-public personal information, we
              cannot guarantee the security of any information you transmit to us or receive from us.
              Once received, we maintain physical, electronic, and procedural safeguards to protect your
              personal information.
            </p>
            <p className={styles.text}>We may disclose information, including non-public personal information, in special cases when we have a good faith belief that such action is necessary to:</p>
            <ul className={styles.list}>
              <li className={styles.listItem}>(a) conform to legal requirements or comply with the legal process such as situations when we are required to do so by federal, state, or local laws and regulations or when we receive a subpoena or are ordered by a court to do so;</li>
              <li className={styles.listItem}>(b) protect and defend our rights; or</li>
              <li className={styles.listItem}>(c) act to protect the interests of our users or others.</li>
            </ul>
            <p className={styles.text}>
              Additionally, we may, without notice to you, provide aggregate statistics about web
              traffic by visitors to the website(s), but these statistics will include no personal
              information.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Third-Party Links</h2>
            <p className={styles.text}>
              XTINTUSA LLC may contain links to other sites, including those of our business partners.
              While we try to link only to sites that share our high standards and respect for privacy,
              we are not responsible for the privacy practices employed by other sites. Visit those sites
              for information regarding their privacy policy prior to providing personal information.
            </p>
            <p className={styles.text}>
              The links we provide on XTINTUSA LLC are there for your reference and convenience. We do
              not control any of these websites, nor are we responsible for their content. If you decide
              to access any of these websites you do so entirely at your own risk.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Modification of Terms and Conditions</h2>
            <p className={styles.text}>
              XTINTUSA LLC reserves the right, at its sole discretion, to change, modify, add or remove
              any portion of this Agreement, in whole or in part, at any time. Modifications or changes
              in the Agreement will be posted on the website. XTINTUSA LLC may change, suspend or
              discontinue any aspect of the website at any time, including the availability of any
              website feature, database, or content.
            </p>
            <p className={styles.text}>
              By using this website, you agree to be bound by any such revisions and should therefore
              periodically visit this page to determine the current terms of use to which you are bound.
            </p>
          </section>

          {/* ── TERMS AND CONDITIONS ── */}
          <div id="terms-and-conditions" style={{ scrollMarginTop: '80px' }}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle} style={{ color: 'var(--accent)', fontSize: '1.5rem' }}>Terms &amp; Conditions</h2>
              <p className={styles.text}>
                By providing your phone number, you consent to receive conversational messages from
                XTINTUSA LLC. Message frequency may vary. On average, you may receive 1–2 messages per
                month. Message and data rates may apply. To stop receiving messages, reply STOP at any
                time. For assistance, reply HELP. For more information, please review our privacy policy
                on this page.
              </p>
            </section>
          </div>

          {/* ── PRIVACY POLICY ── */}
          <div id="privacy-policy" style={{ scrollMarginTop: '80px' }}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle} style={{ color: 'var(--accent)', fontSize: '1.5rem' }}>Privacy Policy</h2>
              <p className={styles.text}>
                We are committed to protecting your privacy. Your personal information, including mobile
                data, will never be shared with third parties for marketing purposes under any
                circumstances. Data sharing is strictly limited to operational purposes necessary to
                provide and maintain our services.
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>Your data will not be transferred to external organizations.</li>
                <li className={styles.listItem}>We maintain strict internal controls to prevent unauthorized access or sharing of your information.</li>
                <li className={styles.listItem}>All data handling is conducted in accordance with applicable privacy laws and best practices.</li>
              </ul>
              <p className={styles.text} style={{ marginTop: '16px' }}>
                If you have any questions about our data protection practices, please contact us using
                the information provided below.
              </p>
            </section>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Us</h2>
            <div className={styles.contactBox}>
              <p className={styles.contactText}>XTINTUSA LLC</p>
              <p className={styles.contactText}>Houston, TX</p>
              <p className={styles.contactText}>Phone: (832) 776-5717</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
