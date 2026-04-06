'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  // Navigation Visibility State
  const [navVisible, setNavVisible] = useState(false);

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Testimonial Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceType, setServiceType] = useState('');

  // Film Learn More State
  const [learnMoreFilm, setLearnMoreFilm] = useState(null);
  const [activeFilmTab, setActiveFilmTab] = useState('automotive');

  // Timeline Animation State

  // Touch tracking for swipe
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Mobile Menu Toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'auto';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Smooth scroll to sections
  const smoothScroll = (e) => {
    const href = e.currentTarget.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMobileMenu();
      }
    }
  };

  // Testimonial Slider Functions
  const changeSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonialsCount);
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonialsCount) % testimonialsCount);
  };

  // Auto-play testimonials
  useEffect(() => {
    if (window.innerWidth > 768) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonialsCount);
    }, 5000);

    const handleResize = () => {
      if (window.innerWidth > 768) {
        clearInterval(interval);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

  // Testimonial touch handlers
  const handleTestimonialTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].screenX);
  };

  const handleTestimonialTouchEnd = (e) => {
    setTouchEndX(e.changedTouches[0].screenX);
    const swipeThreshold = 50;

    if (e.changedTouches[0].screenX < touchStartX - swipeThreshold) {
      nextSlide();
    }
    if (e.changedTouches[0].screenX > touchStartX + swipeThreshold) {
      previousSlide();
    }
  };

  // Toggle quote form fields
  const toggleQuoteFields = (value) => {
    setServiceType(value);
  };

  // Modal Functions
  const openQuoteModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeQuoteModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeQuoteModal();
    }
  };

  // Timeline Animation on Scroll
  // Parallax effect + nav visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      // Show nav once scrolled past the hero section
      setNavVisible(scrolled > window.innerHeight * 0.85);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fade in animations
  useEffect(() => {
    const fadeElements = document.querySelectorAll(
      `.${styles.serviceCard}, .${styles.processStep}, .${styles.galleryItem}`
    );

    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    fadeElements.forEach((el) => fadeObserver.observe(el));

    return () => {
      fadeElements.forEach((el) => fadeObserver.unobserve(el));
    };
  }, []);

  // Keyboard escape handler for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeQuoteModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const testimonials = [
    {
      rating: '5.0',
      text: '"Exceptional service from start to finish. A new house is being built next to mine, the darkness is so nice."',
      author: '— Danni, Residential'
    },
    {
      rating: '5.0',
      text: '"I made a home theater, wanted a darker experience during the day, the added privacy of my neighboors not snooping is a big jump."',
      author: '— Darrian, Residential'
    },
    {
      rating: '5.0',
      text: '"Professional, lovely price, lovely work. 11/10."',
      author: '— James Rodriguez, Automotive'
    },
    {
      rating: '5.0',
      text: '"My car used to be an oven in the Houston heat. After getting my windows tinted, the AC actually keeps up now. Worth every penny."',
      author: '— Marcus T., Automotive'
    },
    {
      rating: '5.0',
      text: '"Xander showed up on time, worked efficiently, and my front windows look amazing. No more sun glare on my TV during the afternoon!"',
      author: '— Sarah Chen, Residential'
    },
    {
      rating: '5.0',
      text: '"Clean work, attention to detail, and Xander explained everything clearly. My truck looks sharp and stays cooler. Highly recommend."',
      author: '— Robert M., Automotive'
    }
  ];

  const testimonialsCount = testimonials.length;

  return (
    <main>
      {/* Noise Overlay */}
      <div className={styles.noise}></div>

      {/* Mobile Menu Backdrop */}
      <div
        className={`${styles.menuBackdrop} ${isMobileMenuOpen ? styles.active : ''}`}
        id="menuBackdrop"
        onClick={closeMobileMenu}
      ></div>

      {/* Navigation */}
      <nav className={`${styles.nav} ${navVisible ? styles.navVisible : ''}`}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <img src="/images/logo1.png" alt="XTint Logo" />
          </div>
          <button
            className={`${styles.mobileMenuToggle} ${isMobileMenuOpen ? styles.active : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul className={`${styles.navMenu} ${isMobileMenuOpen ? styles.active : ''}`} id="navMenu">
            <li><a href="#services" onClick={smoothScroll}>Services</a></li>
            <li><a href="#gallery" onClick={smoothScroll}>Work</a></li>
            <li><a href="#about" onClick={smoothScroll}>About</a></li>
            <li><a href="#contact" onClick={smoothScroll}>Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <video autoPlay muted loop playsInline className={styles.heroBgVideo}>
            <source src="/images/hero-bg.mp4" type="video/mp4" />
          </video>
        </div>
        <img src="/images/logo1.png" alt="XTint Logo" className={styles.heroLogo} />
        <div className={styles.heroLeft}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>Residential & Automotive Services • Houston TX</div>
            <h1 className={styles.heroH1}>
              <span>
                <span className={`${styles.word} ${styles.textOutline}`} style={{ animationDelay: '0s' }}>
                  Service{' '}
                </span>
              </span>
              <span>
                <span className={styles.word} style={{ animationDelay: '0.1s' }}>
                  Redefined
                </span>
              </span>
            </h1>
            <div className={styles.heroCta}>
              <a href="#contact" className={styles.btnPrimary} onClick={smoothScroll}>
                Contact
              </a>
              <a href="#services" className={styles.btnSecondary} onClick={smoothScroll}>
                Explore
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ticker */}
      <div className={styles.ticker}>
        <div className={styles.tickerContent}>
          {[...Array(30)].map((_, i) => (
            <React.Fragment key={i}>
              <span className={styles.tickerItem}>★ LIFETIME WARRANTY</span>
              <span className={styles.tickerItem}>★ SAME DAY SERVICE</span>
              <span className={styles.tickerItem}>★ BUSINESS INSTALLATION</span>
              <span className={styles.tickerItem}>★ CERAMIC TECHNOLOGY</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className={styles.highlightBox}>
        ✓ FREE SHUTTLE SERVICE UP TO 5 MILES*
      </div>

      {/* Services Section */}
      <section className={styles.services} id="services">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionNumber}>01 — SERVICES</p>
          <h2 className={styles.sectionTitle}>
            What We<br />
            Offer
          </h2>
        </div>
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIconWrap}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="22" height="18" rx="2" ry="2"/>
                <line x1="1" y1="9" x2="23" y2="9"/>
              </svg>
            </div>
            <span className={styles.serviceLabel}>01</span>
            <h3>Automotive Window Tint</h3>
            <p>
              Premium ceramic films engineered to reject heat, block UV rays, and enhance privacy
              without compromising visibility.
            </p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIconWrap}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span className={styles.serviceLabel}>02</span>
            <h3>Residential Window Tint</h3>
            <p>
              Premium ceramic films designed to keep your home cooler, protect interiors from harmful
              UV rays, and provide daytime privacy — all while maintaining a clear, natural view.
            </p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIconWrap}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                <path d="M1 10h22"/>
                <rect x="6" y="14" width="4" height="4" rx="1"/>
              </svg>
            </div>
            <span className={styles.serviceLabel}>03</span>
            <h3>Commercial Window Tint</h3>
            <p>
              Professional window tinting for storefronts, offices, and commercial buildings — reducing
              glare, cutting energy costs, and adding a sleek, uniform look.
            </p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIconWrap}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span className={styles.serviceLabel}>04</span>
            <h3>PPF Installation</h3>
            <p>
              Paint protection film applied with precision to guard your vehicle&apos;s finish against
              rock chips, scratches, and road debris — keeping it looking factory-fresh.
            </p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIconWrap}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="9" y1="18" x2="15" y2="18"/>
                <line x1="10" y1="22" x2="14" y2="22"/>
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
              </svg>
            </div>
            <span className={styles.serviceLabel}>05</span>
            <h3>LED Interior Lighting</h3>
            <p>
              Custom LED interior lighting installations to transform your vehicle&apos;s cabin with
              ambient accent lighting, footwell LEDs, and dashboard illumination.
            </p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIconWrap}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className={styles.serviceLabel}>06</span>
            <h3>Auto Interior Detailing</h3>
            <p>
              Full interior detailing including hand wash, deep vacuum, interior cleaning,
              light ceramic coating, and more — everything your vehicle needs to look showroom-fresh.
            </p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIconWrap}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <span className={styles.serviceLabel}>07</span>
            <h3>Window Cleaning</h3>
            <p>
              Professional window cleaning for residential and commercial properties — streak-free
              results that let the light in and keep your space looking sharp.
            </p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIconWrap}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <span className={styles.serviceLabel}>08</span>
            <h3>Customer Status Tracker</h3>
            <p>
              Real-time updates on your vehicle&apos;s service progress — know exactly what stage your
              car is at, from drop-off to completion, all from your phone.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className={styles.gallery} id="gallery">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionNumber}>02 — PORTFOLIO</p>
          <h2 className={styles.sectionTitle}>
            Recent<br />
            Projects
          </h2>
        </div>

        <div className={styles.socialFeeds}>
          <div className={styles.socialFeed}>
            <h3 className={styles.socialFeedTitle}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              @Xtintusallc
            </h3>
            <div className={styles.socialEmbedContainer}>
              <iframe
                src="https://www.instagram.com/Xtintusallc/embed"
                width="100%"
                height="500"
                frameBorder="0"
                scrolling="no"
                loading="lazy"
                title="XTint Instagram Feed"
              ></iframe>
            </div>
            <a
              href="https://www.instagram.com/Xtintusallc/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialFollowBtn}
            >
              Follow on Instagram
            </a>
          </div>

          <div className={styles.socialFeed}>
            <h3 className={styles.socialFeedTitle}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.48a8.18 8.18 0 004.76 1.52V7.56a4.83 4.83 0 01-1-.87z"/></svg>
              @xtintusa
            </h3>
            <div className={styles.socialEmbedContainer}>
              <iframe
                src="https://www.tiktok.com/embed/@xtintusa"
                width="100%"
                height="500"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                loading="lazy"
                title="XTint TikTok Feed"
              ></iframe>
            </div>
            <a
              href="https://www.tiktok.com/@xtintusa"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialFollowBtn}
            >
              Follow on TikTok
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials} id="testimonials">
        <div className={styles.testimonialsContainer}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionNumber}>03 — TESTIMONIALS</p>
            <h2 className={styles.sectionTitle}>
              Client<br />
              Reviews
            </h2>
          </div>
          <div
            className={styles.testimonialSlider}
            onTouchStart={handleTestimonialTouchStart}
            onTouchEnd={handleTestimonialTouchEnd}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`${styles.testimonialSlide} ${currentSlide === index ? styles.active : ''}`}
              >
                <div className={styles.testimonialContent}>
                  <div className={styles.testimonialRating}>{testimonial.rating}</div>
                  <div>
                    <p className={styles.testimonialText}>{testimonial.text}</p>
                    <p className={styles.testimonialAuthor}>{testimonial.author}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.testimonialArrows}>
            <button className={styles.arrowBtn} onClick={previousSlide}>
              ←
            </button>
            <button className={styles.arrowBtn} onClick={nextSlide}>
              →
            </button>
          </div>
          <div className={styles.testimonialDots}>
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`${styles.dot} ${currentSlide === index ? styles.active : ''}`}
                onClick={() => changeSlide(index)}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Films Section */}
      <section className={styles.films} id="films">
        <div className={styles.filmsContainer}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionNumber}>04 — FILMS</p>
            <h2 className={styles.sectionTitle}>
              Premium<br />
              Protection
            </h2>
          </div>

          <div className={styles.filmsIntro}>
            <div className={styles.brandBadge}>Official Dealer of GeoShield Films</div>
            <p>
              For our Ceramic Film, we exclusively use GeoShield films — industry-leading technology
              that delivers unmatched performance, durability, and clarity. Quality matters, and we
              stand by every installation.
            </p>
          </div>

          {/* Film Type Nav */}
          <div className={styles.filmNav}>
            <button
              className={`${styles.filmNavBtn} ${activeFilmTab === 'automotive' ? styles.filmNavBtnActive : ''}`}
              onClick={() => setActiveFilmTab('automotive')}
            >Automotive Films</button>
            <button
              className={`${styles.filmNavBtn} ${activeFilmTab === 'rescom' ? styles.filmNavBtnActive : ''}`}
              onClick={() => setActiveFilmTab('rescom')}
            >Residential &amp; Commercial Films</button>
          </div>

          {activeFilmTab === 'rescom' && (
            <div className={styles.resComSection}>
              <p className={styles.resComIntro}>
                We offer a range of residential and commercial films — from high-performance reflective options to decorative and safety solutions. Every install is backed by our quality guarantee.
              </p>
              <div className={styles.resFilmsGrid}>

                {/* Dual Reflective & Sputtered */}
                <div className={styles.filmCard}>
                  <div className={styles.filmType}>Reflective Series</div>
                  <h3>Dual Reflective<br />&amp; Sputtered</h3>
                  <p className={styles.resFilmModels}>Super Alloy · Geo · Astro · 20/20</p>
                  <div className={styles.filmSpecs}>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Solar Rejection</span>
                      <span className={styles.specValue}>Up to 79%</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>UV Rejection</span>
                      <span className={styles.specValue}>99%</span>
                    </div>
                  </div>
                  <div className={styles.filmFeatures}>
                    <ul>
                      <li>Maximum solar heat rejection</li>
                      <li>Sleek mirrored exterior finish</li>
                      <li>Significant glare reduction</li>
                      <li>UV ray protection</li>
                      <li>Interior &amp; exterior options</li>
                    </ul>
                  </div>
                  <div className={styles.vltOptions}>
                    <h4>Available VLT</h4>
                    <div className={styles.resVltGrid}>
                      <div className={styles.resVltWindow} style={{ background: 'rgba(10,10,10,0.96)', color: '#555' }}>5%</div>
                      <div className={styles.resVltWindow} style={{ background: 'rgba(20,20,20,0.85)', color: '#777' }}>15%</div>
                      <div className={styles.resVltWindow} style={{ background: 'rgba(35,35,35,0.72)', color: '#999' }}>20%</div>
                      <div className={styles.resVltWindow} style={{ background: 'rgba(50,50,50,0.60)', color: '#aaa' }}>25%</div>
                      <div className={styles.resVltWindow} style={{ background: 'rgba(65,65,65,0.50)', color: '#bbb' }}>30%</div>
                      <div className={styles.resVltWindow} style={{ background: 'rgba(80,80,80,0.42)', color: '#bbb' }}>35%</div>
                      <div className={styles.resVltWindow} style={{ background: 'rgba(95,95,95,0.34)', color: '#ccc' }}>40%</div>
                      <div className={styles.resVltWindow} style={{ background: 'rgba(115,115,115,0.24)', color: '#ddd' }}>50%</div>
                    </div>
                  </div>
                  <button className={styles.filmLearnMoreBtn} onClick={() => setLearnMoreFilm('reflective')}>Learn More</button>
                </div>

                {/* Specialty Films */}
                <div className={styles.filmCard}>
                  <div className={styles.filmType}>Specialty Series</div>
                  <h3>Specialty<br />Films</h3>
                  <p className={styles.resFilmModels}>Lunar · Ultra · White Frost · Blackout · Solar Bronze</p>
                  <div className={styles.filmSpecs}>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Applications</span>
                      <span className={styles.specValue}>5 Types</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>UV Rejection</span>
                      <span className={styles.specValue}>99%</span>
                    </div>
                  </div>
                  <div className={styles.filmFeatures}>
                    <ul>
                      <li>Decorative &amp; privacy options</li>
                      <li>Dual pane compatible (Lunar)</li>
                      <li>Ceramic specialty (Ultra)</li>
                      <li>Complete blackout available</li>
                      <li>Custom aesthetic finishes</li>
                    </ul>
                  </div>
                  <div className={styles.vltOptions}>
                    <h4>Available VLT</h4>
                    <div className={styles.resVltGrid}>
                      <div className={styles.resVltWindow} style={{ background: 'rgba(0,0,0,1)', color: '#333' }}>0%</div>
                      <div className={styles.resVltWindow} style={{ background: 'rgba(35,35,35,0.72)', color: '#999' }}>20%</div>
                      <div className={styles.resVltWindow} style={{ background: 'rgba(110,110,110,0.26)', color: '#ccc' }}>55%</div>
                      <div className={styles.resVltWindow} style={{ background: 'rgba(130,130,130,0.18)', color: '#ddd' }}>70%</div>
                    </div>
                  </div>
                  <button className={styles.filmLearnMoreBtn} onClick={() => setLearnMoreFilm('specialty')}>Learn More</button>
                </div>

                {/* Safety Film */}
                <div className={styles.filmCard}>
                  <div className={styles.filmType}>Safety Film</div>
                  <h3>8 Mil<br />Safety Film</h3>
                  <p className={styles.resFilmModels}>8 Ply · PS Adhesive · Clear</p>
                  <div className={styles.filmSpecs}>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>UV Rejection</span>
                      <span className={styles.specValue}>99%</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>VLT</span>
                      <span className={styles.specValue}>72%</span>
                    </div>
                  </div>
                  <div className={styles.filmFeatures}>
                    <ul>
                      <li>Shatter &amp; impact resistant</li>
                      <li>CPSC CFR 1201 certified</li>
                      <li>GSA security criteria met</li>
                      <li>Holds glass together on impact</li>
                      <li>Clear — preserves natural light</li>
                    </ul>
                  </div>
                  <div className={styles.vltOptions}>
                    <h4>Available VLT</h4>
                    <div className={styles.resVltGrid}>
                      <div className={styles.resVltWindow} style={{ background: 'rgba(140,140,140,0.16)', color: '#ddd' }}>72%</div>
                    </div>
                  </div>
                  <button className={styles.filmLearnMoreBtn} onClick={() => setLearnMoreFilm('safety')}>Learn More</button>
                </div>

              </div>
            </div>
          )}

          {activeFilmTab === 'automotive' && <div className={styles.filmsGrid}>

            {/* X1 Carbon */}
            <div className={styles.filmCard}>
              <div className={styles.filmType}>Carbon Film</div>
              <h3>X1<br />Carbon</h3>

              <div className={styles.filmSpecs}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Heat Rejection</span>
                  <span className={styles.specValue}>51%</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>UV Rejection</span>
                  <span className={styles.specValue}>99%</span>
                </div>
              </div>

              <div className={styles.filmFeatures}>
                <ul>
                  <li>Keeps You Comfortable</li>
                  <li>Reduces Glare</li>
                  <li>UV Ray Protection</li>
                  <li>Crystal Clear Signal</li>
                  <li>Looks Great</li>
                </ul>
              </div>

              <div className={styles.vltOptions}>
                <h4>Available VLT</h4>
                <div className={styles.vltGrid}>
                  <div className={styles.vltWindow} style={{ background: 'rgba(10,10,10,0.96)', color: '#555' }}>5%</div>
                  <div className={styles.vltWindow} style={{ background: 'rgba(20,20,20,0.85)', color: '#777' }}>15%</div>
                  <div className={styles.vltWindow} style={{ background: 'rgba(40,40,40,0.65)', color: '#aaa' }}>35%</div>
                </div>
              </div>

              <button className={styles.filmLearnMoreBtn} onClick={() => setLearnMoreFilm('x1')}>Learn More</button>
            </div>

            {/* X2 Pro */}
            <div className={styles.filmCard}>
              <div className={styles.premiumBadge}>Recommended</div>
              <div className={styles.filmType}>Ceramic Film</div>
              <h3>X2<br />Pro</h3>

              <div className={styles.filmSpecs}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Heat Rejection</span>
                  <span className={styles.specValue}>85%</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>UV Rejection</span>
                  <span className={styles.specValue}>99%</span>
                </div>
              </div>

              <div className={styles.filmFeatures}>
                <ul>
                  <li>Keeps You Comfortable</li>
                  <li>Reduces Glare</li>
                  <li>UV Ray Protection</li>
                  <li>Crystal Clear Signal</li>
                  <li>Looks Great</li>
                  <li>Near-Zero Haze</li>
                </ul>
              </div>

              <div className={styles.vltOptions}>
                <h4>Available VLT</h4>
                <div className={styles.vltGrid}>
                  <div className={styles.vltWindow} style={{ background: 'rgba(10,10,10,0.96)', color: '#555' }}>5%</div>
                  <div className={styles.vltWindow} style={{ background: 'rgba(20,20,20,0.85)', color: '#777' }}>15%</div>
                  <div className={styles.vltWindow} style={{ background: 'rgba(40,40,40,0.65)', color: '#aaa' }}>35%</div>
                  <div className={styles.vltWindow} style={{ background: 'rgba(60,60,60,0.50)', color: '#bbb' }}>40%</div>
                  <div className={styles.vltWindow} style={{ background: 'rgba(80,80,80,0.40)', color: '#bbb' }}>50%</div>
                  <div className={styles.vltWindow} style={{ background: 'rgba(110,110,110,0.28)', color: '#ccc' }}>70%</div>
                </div>
              </div>

              <button className={styles.filmLearnMoreBtn} onClick={() => setLearnMoreFilm('x2')}>Learn More</button>
            </div>

          </div>}

          <div className={styles.filmsCta}>
            <button className={styles.btnPrimary} onClick={openQuoteModal}>
              Get a Quote
            </button>
          </div>
        </div>

        {/* Learn More Overlay */}
        {learnMoreFilm && (
          <div className={styles.filmOverlay} onClick={() => setLearnMoreFilm(null)}>
            <div className={styles.filmPanel} onClick={e => e.stopPropagation()}>
              <button className={styles.filmPanelClose} onClick={() => setLearnMoreFilm(null)}>✕</button>

              {learnMoreFilm === 'x1' && (
                <>
                  <p className={styles.filmPanelType}>Carbon Film</p>
                  <h3 className={styles.filmPanelTitle}>X1 Carbon</h3>
                  <p className={styles.filmPanelDesc}>The X1 Carbon is our entry-level carbon film — a solid performer that delivers real heat and UV protection at a great value. Built for drivers who want quality without overpaying.</p>
                  <div className={styles.filmPanelSpecs}>
                    <div><span>Heat Rejection</span><strong>51%</strong></div>
                    <div><span>UV Rejection</span><strong>99%</strong></div>
                    <div><span>Signal Block</span><strong>None</strong></div>
                    <div><span>Available Shades</span><strong>5% · 15% · 35%</strong></div>
                  </div>
                  <ul className={styles.filmPanelList}>
                    <li>Noticeably cooler interior on hot days</li>
                    <li>Reduces eye strain and glare while driving</li>
                    <li>Blocks 99% of harmful UV rays — protects skin &amp; interior</li>
                    <li>Won&apos;t interfere with GPS, Apple CarPlay, or cell signal</li>
                    <li>Clean, professional finish that enhances your vehicle&apos;s look</li>
                  </ul>
                </>
              )}

              {learnMoreFilm === 'x2' && (
                <>
                  <p className={styles.filmPanelType}>Ceramic Film</p>
                  <h3 className={styles.filmPanelTitle}>X2 Pro</h3>
                  <p className={styles.filmPanelDesc}>The X2 Pro is our top-tier ceramic film — engineered for maximum heat rejection, near-zero haze, and crystal clarity. If you want the best, this is it.</p>
                  <div className={styles.filmPanelSpecs}>
                    <div><span>Heat Rejection</span><strong>85%</strong></div>
                    <div><span>UV Rejection</span><strong>99%</strong></div>
                    <div><span>Signal Block</span><strong>None</strong></div>
                    <div><span>Available Shades</span><strong>5% · 15% · 35% · 40% · 50% · 70%</strong></div>
                  </div>
                  <ul className={styles.filmPanelList}>
                    <li>Dramatically cooler interior — 85% heat rejection speaks for itself</li>
                    <li>Near-zero haze — exceptional optical clarity</li>
                    <li>Blocks 99% of UV rays — the gold standard for protection</li>
                    <li>Zero signal interference — GPS, phone, CarPlay all work perfectly</li>
                    <li>More shade options including 40%, 50% &amp; 70% for lighter coverage</li>
                    <li>Premium look with a flawless, professional finish</li>
                  </ul>
                </>
              )}

              {learnMoreFilm === 'reflective' && (
                <>
                  <p className={styles.filmPanelType}>Reflective Series</p>
                  <h3 className={styles.filmPanelTitle}>Dual Reflective &amp; Sputtered</h3>
                  <p className={styles.filmPanelDesc}>Our reflective line includes Super Alloy, Geo, Astro, and 20/20 — each engineered to maximize solar rejection while maintaining a clean, professional appearance for homes and commercial spaces.</p>
                  <div className={styles.filmPanelSpecs}>
                    <div><span>Solar Rejection</span><strong>Up to 79%</strong></div>
                    <div><span>UV Rejection</span><strong>99%</strong></div>
                    <div><span>Interior Reflectance</span><strong>Varies</strong></div>
                    <div><span>Available Shades</span><strong>5% · 15% · 20% · 25% · 30% · 35% · 40% · 50%</strong></div>
                  </div>
                  <ul className={styles.filmPanelList}>
                    <li>Super Alloy — dual reflective, available in 5%, 15%, 25%, 35%</li>
                    <li>Geo — sputtered film, available in 30%, 40%, 50%</li>
                    <li>Astro — silver reflective, available in 15%</li>
                    <li>20/20 — silver reflective interior &amp; exterior film, available in 20%</li>
                    <li>Blocks 99% UV rays — protects furniture, flooring &amp; artwork</li>
                    <li>Significantly reduces cooling costs in Houston&apos;s heat</li>
                  </ul>
                </>
              )}

              {learnMoreFilm === 'specialty' && (
                <>
                  <p className={styles.filmPanelType}>Specialty Series</p>
                  <h3 className={styles.filmPanelTitle}>Specialty Films</h3>
                  <p className={styles.filmPanelDesc}>Five distinct specialty films covering dual pane, ceramic, decorative, privacy, and complete blackout applications — for spaces where standard films won&apos;t cut it.</p>
                  <div className={styles.filmPanelSpecs}>
                    <div><span>Film Options</span><strong>5 Types</strong></div>
                    <div><span>UV Rejection</span><strong>99%</strong></div>
                    <div><span>VLT Range</span><strong>0% – 70%</strong></div>
                    <div><span>Dual Pane Safe</span><strong>Lunar Series</strong></div>
                  </div>
                  <ul className={styles.filmPanelList}>
                    <li>Lunar — specialty dual pane compatible film, 20% VLT</li>
                    <li>Ultra — specialty ceramic film, 70% VLT, maximum clarity</li>
                    <li>White Frost — decorative frosted privacy film, 55% VLT</li>
                    <li>Blackout — complete privacy, 0% VLT, total light block</li>
                    <li>Solar Bronze — decorative bronze tint with solar benefits, 20% VLT</li>
                    <li>All options block 99% UV rays and reduce heat gain</li>
                  </ul>
                </>
              )}

              {learnMoreFilm === 'safety' && (
                <>
                  <p className={styles.filmPanelType}>Safety Film</p>
                  <h3 className={styles.filmPanelTitle}>8 Mil Clear Safety Film</h3>
                  <p className={styles.filmPanelDesc}>Our 8-ply safety film is engineered to hold shattered glass in place on impact — protecting your home or business from break-ins, accidents, and severe weather without changing how your windows look.</p>
                  <div className={styles.filmPanelSpecs}>
                    <div><span>Thickness</span><strong>8 Mil</strong></div>
                    <div><span>UV Rejection</span><strong>99%</strong></div>
                    <div><span>VLT</span><strong>72% (Clear)</strong></div>
                    <div><span>Tensile Strength</span><strong>30,000 psi</strong></div>
                  </div>
                  <ul className={styles.filmPanelList}>
                    <li>Holds glass in place on impact — reduces injury risk dramatically</li>
                    <li>CPSC CFR 1201 Category II certified for safety glazing</li>
                    <li>Meets GSA security criteria — used in government buildings</li>
                    <li>Tensile strength: 30,000 psi · Puncture strength: 3,325 gm/in</li>
                    <li>Blocks 99% UV rays while maintaining natural light at 72% VLT</li>
                    <li>Clear finish — virtually invisible once applied</li>
                  </ul>
                </>
              )}

              <button className={styles.btnPrimary} onClick={() => { setLearnMoreFilm(null); openQuoteModal(); }} style={{ marginTop: '30px' }}>Get a Quote</button>
            </div>
          </div>
        )}
      </section>

      {/* Quote Modal */}
      <div
        className={`${styles.modal} ${isModalOpen ? styles.active : ''}`}
        id="quoteModal"
        onClick={handleModalBackdropClick}
      >
        <div className={styles.modalContent}>
          <button className={styles.closeModal} onClick={closeQuoteModal}>
            ×
          </button>
          <section className={styles.formcarryContainer}>
            <h3>Get Your Quote</h3>
            <p className={styles.subtitle}>All quotes are answered same buisness day</p>
            <form action="https://formcarry.com/s/lDJki5Kbs4H" method="POST">
              <div className={styles.formcarryBlock}>
                <label htmlFor="fc-name">Full Name</label>
                <input type="text" name="name" id="fc-name" placeholder="Your full name" required />
              </div>

              <div className={styles.formcarryBlock}>
                <label htmlFor="fc-phone">Phone Number</label>
                <input type="tel" name="phone" id="fc-phone" placeholder="(555) 123-4567" required />
              </div>

              <div className={styles.formcarryBlock}>
                <label htmlFor="fc-service-type">Service Type</label>
                <select
                  name="serviceType"
                  id="fc-service-type"
                  onChange={(e) => toggleQuoteFields(e.target.value)}
                  required
                >
                  <option value="">Select a service</option>
                  <option value="automotive">Automotive Tinting</option>
                  <option value="residential">Residential Tinting</option>
                </select>
              </div>

              {/* Automotive Fields */}
              {serviceType === 'automotive' && (
                <div id="automotive-fields">
                  <div className={styles.formcarryBlock}>
                    <label htmlFor="fc-brand">Car Brand</label>
                    <input type="text" name="brand" id="fc-brand" placeholder="Toyota, Honda, BMW" required />
                  </div>

                  <div className={styles.formcarryBlock}>
                    <label htmlFor="fc-year">Year</label>
                    <input type="text" name="year" id="fc-year" placeholder="2023" required />
                  </div>

                  <div className={styles.formcarryBlock}>
                    <label htmlFor="fc-model">Make/Model</label>
                    <input type="text" name="model" id="fc-model" placeholder="Camry, Civic, M3" required />
                  </div>
                </div>
              )}

              {/* Residential Fields */}
              {serviceType === 'residential' && (
                <div id="residential-fields">
                  <div className={styles.formcarryBlock}>
                    <label htmlFor="fc-address">Address</label>
                    <input
                      type="text"
                      name="address"
                      id="fc-address"
                      placeholder="123 Main St, Houston, TX 77429"
                      required
                    />
                  </div>

                  <div className={styles.formcarryBlock}>
                    <label htmlFor="fc-windows">Number of Windows</label>
                    <input type="number" name="windows" id="fc-windows" placeholder="10" min="1" required />
                  </div>

                  <div className={styles.formcarryBlock}>
                    <label htmlFor="fc-property-type">Property Type</label>
                    <select name="propertyType" id="fc-property-type" required>
                      <option value="">Select property type</option>
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="office">Office</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              <div className={styles.formcarryBlock}>
                <button type="submit">Submit Quote Request</button>
              </div>
            </form>
          </section>
        </div>
      </div>

      {/* About Section */}
      <section className={styles.about} id="about">
        <div className={styles.aboutContainer}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionNumber}>05 — ABOUT</p>
            <h2 className={styles.sectionTitle}>
              The<br />
              Story
            </h2>
          </div>
          <div className={styles.aboutContent}>
            <div className={styles.aboutImageContainer}>
              <img src="/images/IMG_3664.JPG" alt="XTint USA" className={styles.aboutImage} />
            </div>
            <div className={styles.aboutText}>
              <div className={styles.founderBadge}>Est. Houston, TX</div>
              <h3>
                Built From <span>Frustration</span>
              </h3>
              <p>
                XTint was born out of a simple realization: <strong>the tint industry was broken.</strong>{' '}
                Overpriced quotes, mediocre installs, and zero transparency had become the norm.
                After experiencing it firsthand — over 15 setups on a single vehicle just trying
                to get it right — enough was enough.
              </p>

              <p>
                <strong>Tint shouldn&apos;t cost you an arm and a leg.</strong> It exists to protect you
                from harmful UV rays, reduce heat, enhance privacy, and improve your daily
                driving or living experience. But somewhere along the way, it became an
                overpriced luxury instead of an accessible necessity.
              </p>

              <p>
                That&apos;s why XTint exists — to prove that <strong>premium quality and fair pricing
                can coexist.</strong> Every installation is done with precision, care, and the
                highest quality ceramic films. No shortcuts. No inflated markups.{' '}
                <strong>No one else will match this quality at these prices.</strong> That&apos;s not a
                slogan — it&apos;s a standard.
              </p>

              <p>
                Whether it&apos;s your daily driver, your dream car, or your home windows — you
                deserve premium protection without the premium price tag.
              </p>

              <div className={styles.aboutStats}>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>100%</div>
                  <div className={styles.statLabel}>Quality Guarantee</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>Fair</div>
                  <div className={styles.statLabel}>Transparent Pricing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contact} id="contact">
        <div className={styles.contactContent}>
          <div className={styles.contactLeft}>
            <h2>
              Let's<br />
              Connect
            </h2>
            <p>Ready to transform your vehicle? Or home? Schedule your appointment today and experience the difference. Reach out 24/7!</p>
            <div className={styles.heroCta}>
              <a href="tel:832-776-5717" className={styles.btnPrimaryDark}>
                Call Or Text Now
              </a>
              <a
                href="https://app.squareup.com/appointments/buyer/widget/ccpqrsorn0nhf5/LXB9A50T845XB"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnBookNow}
              >
                Book Now
              </a>
              <button
                className={styles.btnSecondaryDark}
                onClick={openQuoteModal}
              >
                Get a Quote
              </button>
            </div>
          </div>

          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <span>📍</span>
              <a href="https://maps.app.goo.gl/B8Yy3fcMyFpz7FW66" target="_blank" rel="noopener noreferrer">Houston, TX (77066)</a>
            </div>
            <div className={styles.contactItem}>
              <span>📞</span>
              <span><a href="tel:832-776-5717">832-776-5717</a></span>
            </div>
            <div className={styles.contactItem}>
              <span>🕐</span>
              <span>Mon & Wed 8AM–4PM</span>
            </div>
            <div className={styles.contactItem}>
              <span>🕐</span>
              <span>Tue & Thu Closed</span>
            </div>
            <div className={styles.contactItem}>
              <span>🕐</span>
              <span>Fri–Sun 7AM–6PM</span>
            </div>
          </div>
        </div>

        <div className={styles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13826.755239567436!2d-95.59323995!3d29.95962845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640d37cfb0dd86f%3A0xf37e437076a87281!2sXTint%20%7C%20Residential%20%26%20Automotive%20Films!5e0!3m2!1sen!2sus!4v1775364157168!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title="XTint Location"
          ></iframe>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <img src="/images/logo1.png" alt="XTint Logo" style={{ height: '70px', width: 'auto', marginBottom: '20px' }} />
            <p>Premium automotive &amp; residential window tinting — Houston, TX.</p>
          </div>
          <div className={styles.footerColumn}>
            <h4>Services</h4>
            <ul>
              <li><a href="#services">Automotive Window Tint</a></li>
              <li><a href="#services">Residential Window Tint</a></li>
              <li><a href="#services">Commercial Window Tint</a></li>
              <li><a href="#services">PPF Installation</a></li>
              <li><a href="#services">LED Interior Lighting</a></li>
              <li><a href="#services">Auto Interior Detailing</a></li>
              <li><a href="#services">Window Cleaning</a></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4>Company</h4>
            <ul>
              <li><a href="#gallery">Portfolio</a></li>
              <li><a href="#testimonials">Reviews</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4>Policy Information</h4>
            <ul>
              <li><a href="/policy#terms-of-use">Terms of Use</a></li>
              <li><a href="/policy#terms-and-conditions">Terms and Conditions</a></li>
              <li><a href="/policy#privacy-policy">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.footerBottomLeft}>
            <p>© 2026 XTINTUSA LLC · Houston, Texas · All rights reserved.</p>
            <p className={styles.footerQuote}>
              No matter your age, you&apos;ll always wish you started younger.<br />
              <u>But today is the youngest you&apos;ll ever be.</u>
            </p>
          </div>
          <img
            src="/images/IMG_5457.WEBP"
            alt="XTint"
            className={styles.footerSideImg}
          />
        </div>
      </footer>
    </main>
  );
}
