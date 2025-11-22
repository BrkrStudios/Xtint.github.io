'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Testimonial Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Gallery State
  const [activeGalleryTab, setActiveGalleryTab] = useState('automotive');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceType, setServiceType] = useState('');

  // Timeline Animation State
  const [isTimelineAnimated, setIsTimelineAnimated] = useState(false);
  const timelineRef = useRef(null);

  // Touch tracking for swipe
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Image Viewer State
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [viewerImage, setViewerImage] = useState('');
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageViewerRef = useRef(null);

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

  // Gallery switching
  const switchGallery = (type) => {
    setActiveGalleryTab(type);
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

  // Image Viewer Functions
  const openImageViewer = (imageSrc) => {
    setViewerImage(imageSrc);
    setImageViewerOpen(true);
    setZoom(1);
    setPanX(0);
    setPanY(0);
    document.body.style.overflow = 'hidden';
  };

  const closeImageViewer = () => {
    setImageViewerOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleImageViewerBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeImageViewer();
    }
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 5));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  const resetZoom = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const handleImageMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleImageMouseMove = (e) => {
    if (isDragging && zoom > 1 && imageViewerRef.current) {
      const rect = imageViewerRef.current.getBoundingClientRect();
      const maxPan = (rect.width * (zoom - 1)) / (2 * zoom);
      const maxPanY = (rect.height * (zoom - 1)) / (2 * zoom);

      let newPanX = e.clientX - dragStart.x;
      let newPanY = e.clientY - dragStart.y;

      newPanX = Math.max(-maxPan, Math.min(maxPan, newPanX));
      newPanY = Math.max(-maxPanY, Math.min(maxPanY, newPanY));

      setPanX(newPanX);
      setPanY(newPanY);
    }
  };

  const handleImageMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageTouchStart = (e) => {
    if (zoom > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - panX, y: e.touches[0].clientY - panY });
    }
  };

  const handleImageTouchMove = (e) => {
    if (isDragging && zoom > 1 && e.touches.length === 1 && imageViewerRef.current) {
      const rect = imageViewerRef.current.getBoundingClientRect();
      const maxPan = (rect.width * (zoom - 1)) / (2 * zoom);
      const maxPanY = (rect.height * (zoom - 1)) / (2 * zoom);

      let newPanX = e.touches[0].clientX - dragStart.x;
      let newPanY = e.touches[0].clientY - dragStart.y;

      newPanX = Math.max(-maxPan, Math.min(maxPan, newPanX));
      newPanY = Math.max(-maxPanY, Math.min(maxPanY, newPanY));

      setPanX(newPanX);
      setPanY(newPanY);
    }
  };

  const handleImageTouchEnd = () => {
    setIsDragging(false);
  };

  // Timeline Animation on Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsTimelineAnimated(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
    };
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const heroImage = document.querySelector(`.${styles.heroImage} img`);
      if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
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
      if (e.key === 'Escape' && imageViewerOpen) {
        closeImageViewer();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, imageViewerOpen]);

  // Mouse wheel zoom handler for image viewer
  useEffect(() => {
    const handleWheel = (e) => {
      if (!imageViewerOpen) return;

      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.3 : 0.3;
      setZoom((prev) => {
        const newZoom = Math.min(Math.max(prev + delta, 1), 5);
        return newZoom;
      });
    };

    if (imageViewerOpen) {
      document.addEventListener('wheel', handleWheel, { passive: false });
      return () => document.removeEventListener('wheel', handleWheel);
    }
  }, [imageViewerOpen]);

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
      <nav className={styles.nav}>
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
            <li><a href="#process" onClick={smoothScroll}>Process</a></li>
            <li><a href="#gallery" onClick={smoothScroll}>Work</a></li>
            <li><a href="#about" onClick={smoothScroll}>About</a></li>
            <li><a href="#contact" onClick={smoothScroll}>Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>Residential & Automotive Services • Houston TX</div>
            <h1 className={styles.heroH1}>
              <span>
                <span className={styles.word} style={{ animationDelay: '0s' }}>
                  Window{' '}
                </span>
              </span>
              <span>
                <span className={`${styles.word} ${styles.textOutline}`} style={{ animationDelay: '0.1s' }}>
                  Tinting{' '}
                </span>
              </span>
              <span>
                <span className={styles.word} style={{ animationDelay: '0.2s' }}>
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
        <div className={styles.heroRight}>
          <div className={styles.heroImage}>
            <img src="/images/7.4.2023-31.jpg" alt="Premium Car" loading="lazy" />
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
              <span className={styles.tickerItem}>★ BUISNESS INSTALLATION</span>
              <span className={styles.tickerItem}>★ CERAMIC TECHNOLOGY</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className={styles.highlightBox}>
        ✓ FREE UBER SERVICE UP TO 5-10 MILES FROM WORK POINT
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
            <span className={styles.serviceNumber}>01</span>
            <div className={styles.serviceIcon}>🎨</div>
            <h3>Automotive Window Tint</h3>
            <p>
              Premium ceramic films engineered to reject heat, block UV rays, and enhance privacy
              without compromising visibility.
            </p>
          </div>
          <div className={styles.serviceCard}>
            <span className={styles.serviceNumber}>02</span>
            <div className={styles.serviceIcon}>🛡️</div>
            <h3>Residential Window Tint</h3>
            <p>
              Premium ceramic films designed to keep your home cooler, protect interiors from harmful
              UV rays, and provide daytime privacy—all while maintaining a clear, natural view.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className={styles.process} id="process">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionNumber}>02 — PROCESS</p>
          <h2 className={styles.sectionTitle}>
            How It<br />
            Works
          </h2>
        </div>
        <div className={styles.processTimeline} ref={timelineRef}>
          <div className={styles.timelineLine}></div>
          <div
            className={`${styles.timelineProgress} ${isTimelineAnimated ? styles.animate : ''}`}
            id="timelineProgress"
          ></div>
          <div className={styles.processSteps}>
            <div className={styles.processStep}>
              <div className={styles.stepCircle}>01</div>
              <h4>Book</h4>
              <p>Schedule your appointment by Texting/Calling/Emailing us directly</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepCircle}>02</div>
              <h4>We Arrive or you arrive</h4>
              <p>Our mobile unit comes to your house, Or you arrive at the shop</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepCircle}>03</div>
              <h4>Install</h4>
              <p>installation with precision and care</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepCircle}>04</div>
              <h4>Enjoy</h4>
              <p>Smile with premium protection and style</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className={styles.gallery} id="gallery">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionNumber}>03 — PORTFOLIO</p>
          <h2 className={styles.sectionTitle}>
            Recent<br />
            Projects
          </h2>
        </div>

        {/* Gallery Tabs */}
        <div className={styles.galleryTabs}>
          <button
            className={`${styles.galleryTab} ${activeGalleryTab === 'automotive' ? styles.active : ''}`}
            onClick={() => switchGallery('automotive')}
          >
            <span>🚗</span> Automotive
          </button>
          <button
            className={`${styles.galleryTab} ${activeGalleryTab === 'residential' ? styles.active : ''}`}
            onClick={() => switchGallery('residential')}
          >
            <span>🏠</span> Residential
          </button>
        </div>

        {/* Automotive Gallery */}
        {activeGalleryTab === 'automotive' && (
          <div className={styles.galleryContainer} id="automotive-gallery">
            <div className={styles.galleryGrid}>
              <div className={styles.galleryItem} onClick={() => openImageViewer('/images/IMG_7833.JPG')} style={{ cursor: 'pointer' }}>
                <img src="/images/IMG_7833.JPG" alt="Porsche 911" loading="lazy" />
                <div className={styles.galleryOverlay}>
                  <h4>Porsche 911</h4>
                  <p>15% All Around</p>
                </div>
              </div>

              <div className={styles.galleryItem} onClick={() => openImageViewer('/images/IMG_1365.jpeg')} style={{ cursor: 'pointer' }}>
                <img src="/images/IMG_1365.jpeg" alt="Kia K4" loading="lazy" />
                <div className={styles.galleryOverlay}>
                  <h4>Kia K4</h4>
                  <p>5% All Around</p>
                </div>
              </div>

              <div className={styles.galleryItem} onClick={() => openImageViewer('/images/IMG_0025.JPG')} style={{ cursor: 'pointer' }}>
                <img src="/images/IMG_0025.JPG" alt="Corvette C5" loading="lazy" />
                <div className={styles.galleryOverlay}>
                  <h4>Corvette C5</h4>
                  <p>35% Front, 15% Back</p>
                </div>
              </div>

                            <div className={styles.galleryItem} onClick={() => openImageViewer('/images/IMG_6533.jpeg')} style={{ cursor: 'pointer' }}>
                <img src="/images/IMG_6533.jpeg" alt="Acura TLX" loading="lazy" />
                <div className={styles.galleryOverlay}>
                  <h4>Acura TLX</h4>
                  <p>35% Front, 15% Back</p>
                </div>
              </div>

              <div className={styles.galleryItem} onClick={() => openImageViewer('/images/IMG_3375.jpeg')} style={{ cursor: 'pointer' }}>
                <img src="/images/IMG_3375.jpeg" alt="Honda Civic Sport" loading="lazy" />
                <div className={styles.galleryOverlay}>
                  <h4>Honda Civic Sport</h4>
                  <p>50% Windshield, 5% All around</p>
                </div>
              </div>

              <div className={styles.galleryItem} onClick={() => openImageViewer('/images/IMG_6113.jpeg')} style={{ cursor: 'pointer' }}>
                <img src="/images/IMG_6113.jpeg" alt="Nissan Altima" loading="lazy" />
                <div className={styles.galleryOverlay}>
                  <h4>Nissan Altima</h4>
                  <p>70% Windshield, 35% All around</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Residential Gallery */}
        {activeGalleryTab === 'residential' && (
          <div className={styles.galleryContainer} id="residential-gallery">
            <div style={{ textAlign: 'center', padding: '100px 40px' }}>
              <h3 style={{ fontSize: '48px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '20px' }}>
                Coming Soon
              </h3>
              <p style={{ fontSize: '18px', color: 'var(--light-gray)' }}>
                Residential project gallery will be updated shortly
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials} id="testimonials">
        <div className={styles.testimonialsContainer}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionNumber}>04 — TESTIMONIALS</p>
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
            <p className={styles.sectionNumber}>05 — FILMS</p>
            <h2 className={styles.sectionTitle}>
              Premium<br />
              Protection
            </h2>
          </div>

          <div className={styles.filmsIntro}>
            <div className={styles.brandBadge}>Trusted Partner: GeoShield</div>
            <p>
              For our Ceramic Film, we exclusively use GeoShield films—industry-leading technology
              that delivers unmatched performance, durability, and clarity. Quality matters, and we
              stand by every installation.
            </p>
          </div>

          <div className={styles.filmsGrid}>
            {/* Regular Film */}
            <div className={styles.filmCard}>
              <div className={styles.filmType}>Residential Option Only</div>
              <h3>
                Regular<br />
                Film
              </h3>
              <div className={styles.filmSpecs}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Heat Rejection</span>
                  <span className={styles.specValue}>54%</span>
                </div>
              </div>
              <div className={styles.filmFeatures}>
                <ul>
                  <li>UV Protection</li>
                  <li>Enhanced Privacy</li>
                  <li>Fade Reduction</li>
                  <li>Glare Control</li>
                  <li>Lifetime Warranty</li>
                </ul>
              </div>
            </div>

            {/* Ceramic Film */}
            <div className={styles.filmCard}>
              <div className={styles.premiumBadge}>Recommended</div>
              <div className={styles.filmType}>Elite Protection</div>
              <h3>
                Ceramic<br />
                Film
              </h3>
              <div className={styles.filmSpecs}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Heat Rejection</span>
                  <span className={styles.specValue}>84%</span>
                </div>
              </div>
              <div className={styles.filmFeatures}>
                <ul>
                  <li>Advanced Ceramic Technology</li>
                  <li>Maximum Heat Reduction</li>
                  <li>99% UV Protection</li>
                  <li>Superior Clarity</li>
                  <li>Lifetime Warranty</li>
                  <li>Automotive Done in Ceramic Only</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.filmsCta}>
            <button className={styles.btnPrimary} onClick={openQuoteModal}>
              Get a Quote
            </button>
          </div>
        </div>
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
            <p className={styles.sectionNumber}>06 — ABOUT</p>
            <h2 className={styles.sectionTitle}>
              The<br />
              Story
            </h2>
          </div>
          <div className={styles.aboutContent}>
            <div className={styles.aboutImageContainer}>
              <img src="/images/IMG_1559.jpeg" alt="Xander Angulo" className={styles.aboutImage} />
            </div>
            <div className={styles.aboutText}>
              <div className={styles.founderBadge}>Founder & Lead Installer</div>
              <h3>
                I'm <span>Xander Angulo</span>
              </h3>
              <p>
                As someone who's had <strong>over 15+ tint setups per vehicle</strong>, I've seen it
                all. I've experienced the overpriced quotes, the mediocre work, and the lack of
                transparency in this industry. That's when I realized something had to change.
              </p>

              <p>
                <strong>Tint shouldn't cost you an arm and a leg.</strong> It's meant to keep you
                protected from harmful UV rays, reduce heat, enhance privacy, and improve your
                driving or living experience. But somehow, it became an overpriced luxury instead of
                an accessible necessity.
              </p>

              <p>
                Here at <strong>XTint</strong>, I stand by my work. Every installation is done with
                precision, care, and the highest quality materials.{' '}
                <strong>No one else will do it as good for our prices.</strong> That's not arrogance,
                that's a promise.
              </p>

              <p>
                Whether it's your daily driver, your dream car, or your home, you deserve premium
                protection without the premium price tag. Let me show you what real quality looks
                like.
              </p>

              <div className={styles.aboutStats}>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>15+</div>
                  <div className={styles.statLabel}>Setups Per Vehicle</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>100%</div>
                  <div className={styles.statLabel}>Quality Guarantee</div>
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
            <p>Ready to transform your vehicle? Or home? Schedule your appointment today and experience the difference.</p>
            <div className={styles.heroCta}>
              <a href="tel:832-776-5717" className={styles.btnPrimaryDark}>
                Call Or Text Now
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
              <a href="https://maps.app.goo.gl/B8Yy3fcMyFpz7FW66" target="_blank" rel="noopener noreferrer">Cypress, TX (77429)</a>
            </div>
            <div className={styles.contactItem}>
              <span>📍</span>
              <span>Copperfield, TX - Coming Soon</span>
            </div>
            <div className={styles.contactItem}>
              <span>📞</span>
              <a href="tel:832-776-5717">832-776-5717</a>
            </div>
            <div className={styles.contactItem}>
              <span>🕐</span>
              <span>Mon-Sun 7AM-8:30PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Image Viewer Modal */}
      {imageViewerOpen && (
        <div
          className={styles.imageViewerBackdrop}
          onClick={handleImageViewerBackdropClick}
          onMouseMove={handleImageMouseMove}
          onMouseUp={handleImageMouseUp}
          onMouseLeave={handleImageMouseUp}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <button
            className={styles.closeImageViewer}
            onClick={closeImageViewer}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              fontSize: '40px',
              cursor: 'pointer',
              zIndex: 1001,
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>

          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
            ref={imageViewerRef}
            onMouseDown={handleImageMouseDown}
            onTouchStart={handleImageTouchStart}
            onTouchMove={handleImageTouchMove}
            onTouchEnd={handleImageTouchEnd}
          >
            <img
              src={viewerImage}
              alt="Zoomed Image"
              draggable="false"
              onDragStart={(e) => e.preventDefault()}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                userSelect: 'none',
                WebkitUserDrag: 'none'
              }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '15px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: '15px 25px',
              borderRadius: '50px',
              zIndex: 1001
            }}
          >
            <button
              onClick={zoomOut}
              disabled={zoom <= 1}
              style={{
                backgroundColor: zoom <= 1 ? '#666' : '#fff',
                color: zoom <= 1 ? '#999' : '#000',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: zoom <= 1 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              −
            </button>
            <span
              style={{
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                minWidth: '60px',
                textAlign: 'center',
                justifyContent: 'center'
              }}
            >
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={zoom >= 5}
              style={{
                backgroundColor: zoom >= 5 ? '#666' : '#fff',
                color: zoom >= 5 ? '#999' : '#000',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: zoom >= 5 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              +
            </button>
            {zoom > 1 && (
              <button
                onClick={resetZoom}
                style={{
                  backgroundColor: '#fff',
                  color: '#000',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                Reset
              </button>
            )}
          </div>

          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              color: '#fff',
              fontSize: '14px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: '10px 15px',
              borderRadius: '4px'
            }}
          >
            {zoom > 1 ? 'Drag to pan • Scroll to zoom' : 'Click to zoom in'}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <img src="/images/logo1.png" alt="XTint Logo" style={{ height: '32px', width: 'auto', marginBottom: '20px' }} />
            <p>A new start to Houston's premier mobile window tinting service.</p>
          </div>
          <div className={styles.footerColumn}>
            <h4>Services</h4>
            <ul>
              <li>
                <a href="#services">Automotive Tinting</a>
              </li>
              <li>
                <a href="#services">Residential Tinting</a>
              </li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#gallery">Portfolio</a>
              </li>
              <li>
                <a href="#testimonials">Reviews</a>
              </li>
              <li>
                <a href="#process">Process</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2025 XTint. All rights reserved.</p>
          <p>Houston, Texas</p>
        </div>
      </footer>
    </main>
  );
}
