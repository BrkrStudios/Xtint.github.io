'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { checkSession } from '@/lib/auth';
import styles from './quote.module.css';

const loadJsPDF = () => import('jspdf').then((mod) => mod.jsPDF);

const FILM_TYPES = {
  regular: { name: 'Regular Film', desc: '54% Heat Rejection' },
  ceramic: { name: 'Ceramic Film', desc: '84% Heat Rejection' },
  reflective: { name: 'Reflective Film', desc: 'Dual Reflective / Sputtered' },
  specialty: { name: 'Specialty Film', desc: 'Decorative / Privacy / Safety' },
  standard: { name: 'Standard Film', desc: 'Basic Protection' },
};

export default function QuoteGenerator() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const logoRef = useRef(null);

  // Form state
  const [docType, setDocType] = useState('quote');
  const [serviceType, setServiceType] = useState('automotive');
  const [customNumber, setCustomNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerVehicle, setCustomerVehicle] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [warrantyNumber, setWarrantyNumber] = useState('');
  const [filmType, setFilmType] = useState('regular');
  const [notes, setNotes] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');

  // Automotive services
  const [frontWindows, setFrontWindows] = useState(false);
  const [backWindows, setBackWindows] = useState(false);
  const [fullWindshield, setFullWindshield] = useState(false);
  const [sunvisor, setSunvisor] = useState(false);
  const [removal, setRemoval] = useState(false);
  const [residentialRemoval, setResidentialRemoval] = useState(false);

  // Prices
  const [priceFront, setPriceFront] = useState(85);
  const [priceBack, setPriceBack] = useState(140);
  const [priceWindshield, setPriceWindshield] = useState(110);
  const [priceSunvisor, setPriceSunvisor] = useState(35);
  const [priceRemoval, setPriceRemoval] = useState(50);
  const [priceResidentialRemoval, setPriceResidentialRemoval] = useState(75);

  // Percents
  const [percentFront, setPercentFront] = useState(35);
  const [percentBack, setPercentBack] = useState(20);
  const [percentWindshield, setPercentWindshield] = useState(70);
  const [percentSunvisor, setPercentSunvisor] = useState(5);

  // Residential windows
  const [windows, setWindows] = useState([]);
  const windowCounterRef = useRef(0);

  useEffect(() => {
    if (!checkSession()) {
      router.replace('/admin');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const getFilmLabel = (type) => {
    const ft = type || filmType;
    const info = FILM_TYPES[ft];
    return info ? `${info.name} (${info.desc})` : ft;
  };

  const getServices = useCallback(() => {
    const services = [];
    let subtotal = 0;

    if (serviceType === 'automotive') {
      if (frontWindows) {
        const name = docType === 'invoice' ? `Front Windows (2) - ${percentFront}%` : 'Front Windows (2)';
        services.push({ name, price: priceFront });
        subtotal += priceFront;
      }
      if (backWindows) {
        const name = docType === 'invoice' ? `Back Windows + Rear Glass - ${percentBack}%` : 'Back Windows + Rear Glass';
        services.push({ name, price: priceBack });
        subtotal += priceBack;
      }
      if (fullWindshield) {
        const name = docType === 'invoice' ? `Full Windshield - ${percentWindshield}%` : 'Full Windshield';
        services.push({ name, price: priceWindshield });
        subtotal += priceWindshield;
      }
      if (sunvisor) {
        const name = docType === 'invoice' ? `Sunvisor Strip - ${percentSunvisor}%` : 'Sunvisor Strip';
        services.push({ name, price: priceSunvisor });
        subtotal += priceSunvisor;
      }
      if (removal) {
        services.push({ name: 'Tint Removal', price: priceRemoval });
        subtotal += priceRemoval;
      }
    } else {
      windows.forEach((w) => {
        if (w.totalPrice > 0) {
          services.push({
            name: w.name || 'Unnamed Window',
            isWindow: true,
            filmType: w.filmType,
            filmLabel: getFilmLabel(w.filmType),
            quantity: w.quantity,
            width: w.width,
            height: w.height,
            sqft: w.sqft,
            pricePerSqft: w.pricePerSqft,
            percent: w.percent,
            price: w.totalPrice,
          });
          subtotal += w.totalPrice;
        }
      });
      if (residentialRemoval) {
        services.push({ name: 'Tint Removal', price: priceResidentialRemoval, isWindow: false });
        subtotal += priceResidentialRemoval;
      }
    }

    const disc = parseFloat(discountPercent) || 0;
    const discountAmount = (subtotal * disc) / 100;
    const total = subtotal - discountAmount;

    return { services, subtotal, discountAmount, disc, total };
  }, [
    serviceType, docType, frontWindows, backWindows, fullWindshield, sunvisor, removal,
    residentialRemoval, priceFront, priceBack, priceWindshield, priceSunvisor, priceRemoval,
    priceResidentialRemoval, percentFront, percentBack, percentWindshield, percentSunvisor,
    windows, discountPercent,
  ]);

  const { services, subtotal, discountAmount, disc, total } = getServices();

  // Window management
  const addWindow = () => {
    windowCounterRef.current++;
    setWindows((prev) => [
      ...prev,
      {
        id: `window_${windowCounterRef.current}`,
        num: windowCounterRef.current,
        name: '',
        filmType: filmType,
        quantity: 1,
        percent: 20,
        width: 0,
        height: 0,
        sqft: 0,
        pricePerSqft: 0,
        totalOverride: 0,
        totalPrice: 0,
      },
    ]);
  };

  const removeWindow = (id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const updateWindow = (id, field, value) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        const updated = { ...w, [field]: value };
        const sqft = (updated.width / 12) * updated.height;
        const calcPrice = sqft * updated.quantity * updated.pricePerSqft;
        updated.sqft = sqft;
        updated.totalPrice = updated.totalOverride > 0 ? updated.totalOverride : calcPrice;
        return updated;
      })
    );
  };

  // Logo to base64 (returns { data, width, height })
  const getLogoBase64 = () => {
    return new Promise((resolve) => {
      const img = logoRef.current;
      if (!img) { resolve(null); return; }
      const finish = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d').drawImage(img, 0, 0);
        resolve({ data: canvas.toDataURL('image/png'), width: img.naturalWidth, height: img.naturalHeight });
      };
      if (!img.complete) { img.onload = finish; } else { finish(); }
    });
  };

  const generateQuote = async () => {
    const jsPDF = await loadJsPDF();
    const logoInfo = await getLogoBase64();

    let displayCounter;
    if (customNumber.trim()) {
      displayCounter = customNumber.trim();
    } else {
      const counterKey = docType === 'quote' ? 'quoteCounter' : 'invoiceCounter';
      let counter = parseInt(localStorage.getItem(counterKey) || '0');
      counter++;
      localStorage.setItem(counterKey, counter.toString());
      displayCounter = counter;
    }

    const docTitle = docType === 'quote' ? 'Quote' : 'Invoice';
    const vehicleLabel = serviceType === 'automotive' ? 'Vehicle' : 'Property';
    const serviceTypeLabel = serviceType === 'automotive' ? 'Automotive' : 'Residential';
    const cName = customerName || 'N/A';
    const cVehicle = customerVehicle || 'N/A';
    const cPhone = customerPhone || 'N/A';
    const wNumber = warrantyNumber || 'N/A';
    const filmLabel = getFilmLabel();

    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    // Colors
    const black = [0, 0, 0];
    const darkBg = [17, 17, 17];
    const borderColor = [34, 34, 34];
    const accent = [97, 165, 194]; // #61A5C2
    const white = [255, 255, 255];
    const gray = [153, 153, 153];
    const lightGray = [204, 204, 204];
    const dimGray = [102, 102, 102];

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = 210;
    const pageH = 297;
    const margin = 20;
    const contentW = pageW - margin * 2;
    let y = 0;

    // Helper to check if we need a new page
    const checkPage = (needed) => {
      if (y + needed > pageH - 15) {
        pdf.addPage();
        // Fill new page background
        pdf.setFillColor(...black);
        pdf.rect(0, 0, pageW, pageH, 'F');
        y = 15;
      }
    };

    // --- Page background ---
    pdf.setFillColor(...black);
    pdf.rect(0, 0, pageW, pageH, 'F');

    // --- Main card background ---
    const cardX = 12;
    const cardW = pageW - 24;
    pdf.setFillColor(...darkBg);
    pdf.roundedRect(cardX, 8, cardW, pageH - 16, 1, 1, 'F');

    // Card border
    pdf.setDrawColor(...accent);
    pdf.setLineWidth(0.6);
    pdf.roundedRect(cardX, 8, cardW, pageH - 16, 1, 1, 'S');

    y = 20;

    // --- Logo (preserve aspect ratio) ---
    if (logoInfo) {
      try {
        const logoMaxH = 14;
        const aspect = logoInfo.width / logoInfo.height;
        const logoH = logoMaxH;
        const logoW = logoH * aspect;
        pdf.addImage(logoInfo.data, 'PNG', pageW / 2 - logoW / 2, y, logoW, logoH);
        y += logoH + 4;
      } catch {
        y += 4;
      }
    }

    // --- Tagline ---
    pdf.setFontSize(8);
    pdf.setTextColor(...accent);
    pdf.text(`${serviceTypeLabel.toUpperCase()} TINTING SERVICES  •  HOUSTON TX`, pageW / 2, y, { align: 'center' });
    y += 8;

    // --- Quote/Invoice number badge ---
    const badgeText = `${docTitle.toUpperCase()} #${displayCounter}`;
    pdf.setFontSize(10);
    const badgeW = pdf.getTextWidth(badgeText) + 16;
    const badgeX = pageW / 2 - badgeW / 2;
    pdf.setFillColor(...accent);
    pdf.roundedRect(badgeX, y - 4, badgeW, 8, 1, 1, 'F');
    pdf.setTextColor(...black);
    pdf.setFont('helvetica', 'bold');
    pdf.text(badgeText, pageW / 2, y + 1, { align: 'center' });
    y += 12;

    // --- Divider ---
    pdf.setDrawColor(...borderColor);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pageW - margin, y);
    y += 10;

    // --- CUSTOMER INFORMATION section ---
    pdf.setFontSize(8);
    pdf.setTextColor(...accent);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CUSTOMER INFORMATION', margin, y);
    y += 6;

    // Info box background
    let infoRows = serviceType === 'automotive' ? 5 : 4; // residential has no film type row
    if (docType === 'invoice' && wNumber !== 'N/A') infoRows++;
    const infoBoxH = 8 + infoRows * 7 + 2;
    checkPage(infoBoxH + 4);
    pdf.setFillColor(...black);
    pdf.rect(margin, y, contentW, infoBoxH, 'F');
    pdf.setDrawColor(...borderColor);
    pdf.rect(margin, y, contentW, infoBoxH, 'S');

    const infoX = margin + 6;
    const infoValX = margin + 42;
    let infoY = y + 8;

    const drawInfoRow = (label, value) => {
      pdf.setFontSize(8);
      pdf.setTextColor(...gray);
      pdf.setFont('helvetica', 'normal');
      pdf.text(label.toUpperCase() + ':', infoX, infoY);
      pdf.setTextColor(...white);
      pdf.setFont('helvetica', 'bold');
      pdf.text(value, infoValX, infoY);
      infoY += 7;
    };

    drawInfoRow('Name', cName);
    drawInfoRow(vehicleLabel, cVehicle);
    drawInfoRow('Phone', cPhone);
    if (serviceType === 'automotive') {
      drawInfoRow('Film Type', filmLabel);
    }
    drawInfoRow('Service Type', serviceTypeLabel);
    if (docType === 'invoice' && wNumber !== 'N/A') {
      drawInfoRow('Warranty', wNumber);
    }

    y += infoBoxH + 10;

    // --- SERVICES section ---
    checkPage(20);
    pdf.setFontSize(8);
    pdf.setTextColor(...accent);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SERVICES', margin, y);
    y += 6;

    // Services box
    const servicesStartY = y;
    pdf.setFillColor(...black);

    if (services.length === 0) {
      checkPage(16);
      pdf.rect(margin, y, contentW, 14, 'F');
      pdf.setDrawColor(...borderColor);
      pdf.rect(margin, y, contentW, 14, 'S');
      pdf.setFontSize(9);
      pdf.setTextColor(...dimGray);
      pdf.setFont('helvetica', 'normal');
      pdf.text('No services selected', pageW / 2, y + 8, { align: 'center' });
      y += 20;
    } else {
      services.forEach((s, i) => {
        if (s.isWindow) {
          // Residential window item
          const detailLines = (docType === 'invoice' ? 5 : 4) + 1; // +1 for film type
          const itemH = 12 + detailLines * 5 + 4;
          checkPage(itemH + 2);

          // Left accent bar
          pdf.setFillColor(...accent);
          pdf.rect(margin, y, 1.5, itemH, 'F');

          // Background
          pdf.setFillColor(...black);
          pdf.rect(margin + 1.5, y, contentW - 1.5, itemH, 'F');
          pdf.setDrawColor(...borderColor);
          pdf.rect(margin, y, contentW, itemH, 'S');

          // Name and price
          pdf.setFontSize(9);
          pdf.setTextColor(...accent);
          pdf.setFont('helvetica', 'bold');
          pdf.text(s.name, margin + 5, y + 7);
          pdf.setTextColor(...white);
          pdf.text(`$${s.price.toFixed(2)}`, pageW - margin - 5, y + 7, { align: 'right' });

          // Details
          let detY = y + 14;
          pdf.setFontSize(7.5);
          pdf.setFont('helvetica', 'normal');
          const drawDetail = (label, val) => {
            pdf.setTextColor(...lightGray);
            pdf.text(`${label}: `, margin + 5, detY);
            pdf.setTextColor(...white);
            pdf.text(val, margin + 5 + pdf.getTextWidth(`${label}: `), detY);
            detY += 5;
          };
          drawDetail('Film', s.filmLabel || 'N/A');
          drawDetail('Qty', `${s.quantity}`);
          drawDetail('Dimensions', `${s.width.toFixed(2)}" x ${s.height.toFixed(2)}'`);
          drawDetail('Area', `${s.sqft.toFixed(2)} sq ft`);
          drawDetail('Price/Sq Ft', `$${s.pricePerSqft.toFixed(2)}`);
          if (docType === 'invoice') {
            drawDetail('Tint', `${s.percent}%`);
          }

          y += itemH + 3;
        } else {
          // Standard service line
          checkPage(12);
          pdf.setFillColor(...black);
          pdf.rect(margin, y, contentW, 10, 'F');
          if (i < services.length - 1) {
            pdf.setDrawColor(...borderColor);
            pdf.setLineWidth(0.2);
            pdf.line(margin + 4, y + 10, pageW - margin - 4, y + 10);
          }

          pdf.setFontSize(9);
          pdf.setTextColor(...lightGray);
          pdf.setFont('helvetica', 'normal');
          pdf.text(s.name, margin + 5, y + 7);
          pdf.setTextColor(...white);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`$${s.price.toFixed(2)}`, pageW - margin - 5, y + 7, { align: 'right' });

          y += 11;
        }
      });

      // Draw outer border around all services
      pdf.setDrawColor(...borderColor);
      pdf.setLineWidth(0.3);
      pdf.rect(margin, servicesStartY, contentW, y - servicesStartY - 1, 'S');
      y += 4;
    }

    // --- TOTALS section ---
    checkPage(disc > 0 ? 40 : 30);
    pdf.setFillColor(...black);
    const totalsH = disc > 0 ? 36 : 28;
    pdf.rect(margin, y, contentW, totalsH, 'F');
    pdf.setDrawColor(...borderColor);
    pdf.rect(margin, y, contentW, totalsH, 'S');

    let totY = y + 8;
    pdf.setFontSize(9);
    pdf.setTextColor(...gray);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Subtotal', margin + 5, totY);
    pdf.setTextColor(...white);
    pdf.text(`$${subtotal.toFixed(2)}`, pageW - margin - 5, totY, { align: 'right' });

    if (disc > 0) {
      totY += 8;
      pdf.setTextColor(...accent);
      pdf.text(`Discount (${disc}%)`, margin + 5, totY);
      pdf.text(`-$${discountAmount.toFixed(2)}`, pageW - margin - 5, totY, { align: 'right' });
    }

    // Total divider
    totY += 4;
    pdf.setDrawColor(...accent);
    pdf.setLineWidth(0.5);
    pdf.line(margin + 4, totY, pageW - margin - 4, totY);

    totY += 8;
    pdf.setFontSize(14);
    pdf.setTextColor(...accent);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TOTAL', margin + 5, totY);
    pdf.text(`$${total.toFixed(2)}`, pageW - margin - 5, totY, { align: 'right' });

    y += totalsH + 6;

    // --- NOTES section ---
    if (notes) {
      const noteLines = pdf.setFontSize(8).splitTextToSize(notes, contentW - 14);
      const notesH = 14 + noteLines.length * 4;
      checkPage(notesH + 4);

      pdf.setFillColor(10, 26, 34); // #0a1a22
      pdf.rect(margin, y, contentW, notesH, 'F');
      pdf.setDrawColor(...accent);
      pdf.setLineWidth(0.3);
      pdf.rect(margin, y, contentW, notesH, 'S');

      pdf.setFontSize(8);
      pdf.setTextColor(...accent);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ADDITIONAL NOTES', margin + 5, y + 7);

      pdf.setFontSize(8);
      pdf.setTextColor(...lightGray);
      pdf.setFont('helvetica', 'normal');
      pdf.text(noteLines, margin + 5, y + 13);

      y += notesH + 6;
    }

    // --- FOOTER ---
    checkPage(30);
    pdf.setDrawColor(...borderColor);
    pdf.setLineWidth(0.2);
    pdf.line(margin, y, pageW - margin, y);
    y += 8;

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    const footerLines = [
      { label: 'Contact:', value: '(832) 776-5717' },
      { label: 'Email:', value: 'xanderanguloINQ@gmail.com' },
      { label: 'Location:', value: 'Houston, TX' },
      { label: 'Hours:', value: 'Mon-Sun 7AM-8:30PM' },
    ];

    footerLines.forEach((line) => {
      pdf.setTextColor(...accent);
      pdf.setFont('helvetica', 'bold');
      const labelW = pdf.getTextWidth(line.label + ' ');
      pdf.text(line.label, pageW / 2 - (labelW + pdf.getTextWidth(line.value)) / 2, y);
      pdf.setTextColor(...gray);
      pdf.setFont('helvetica', 'normal');
      pdf.text(line.value, pageW / 2 - (labelW + pdf.getTextWidth(line.value)) / 2 + labelW, y);
      y += 5;
    });

    y += 4;
    pdf.setFontSize(7);
    pdf.setTextColor(...dimGray);
    pdf.text(`Generated on ${dateString}`, pageW - margin, y, { align: 'right' });

    // Save
    pdf.save(`${docTitle}${displayCounter}.pdf`);
  };

  const resetForm = () => {
    setCustomNumber('');
    setCustomerName('');
    setCustomerVehicle('');
    setCustomerPhone('');
    setWarrantyNumber('');
    setFilmType('regular');
    setNotes('');
    setDiscountPercent('');
    setFrontWindows(false);
    setBackWindows(false);
    setFullWindshield(false);
    setSunvisor(false);
    setRemoval(false);
    setResidentialRemoval(false);
    setPriceFront(85);
    setPriceBack(140);
    setPriceWindshield(110);
    setPriceSunvisor(35);
    setPriceRemoval(50);
    setPriceResidentialRemoval(75);
    setPercentFront(35);
    setPercentBack(20);
    setPercentWindshield(70);
    setPercentSunvisor(5);
    setWindows([]);
    windowCounterRef.current = 0;
    setDocType('quote');
    setServiceType('automotive');
  };

  if (!authorized) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Verifying access...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Hidden logo for base64 capture */}
      <img ref={logoRef} src="/images/logo1.png" alt="" crossOrigin="anonymous" style={{ display: 'none' }} />

      <a href="/admin/dashboard" className={styles.backButton}>
        <span>&larr;</span>
        <span>Back to Dashboard</span>
      </a>

      <div className={styles.header}>
        <div className={styles.brand}>
          <img src="/images/logo1.png" alt="XTint Logo" className={styles.brandLogo} />
        </div>
        <div className={styles.tagline}>Custom Quote & Invoice Generator</div>
      </div>

      <h1 className={styles.mainTitle}>
        {docType === 'quote' ? 'BUILD QUOTE' : 'BUILD INVOICE'}
      </h1>

      {/* Doc Type & Service Type */}
      <div className={styles.builderSection} style={{ marginBottom: 30 }}>
        <div className={styles.typeGrid}>
          <div>
            <div className={styles.sectionLabel}>Document Type</div>
            <div className={styles.optionGrid}>
              <button
                className={`${styles.optionButton} ${docType === 'quote' ? styles.optionActive : ''}`}
                onClick={() => setDocType('quote')}
              >
                Quote
              </button>
              <button
                className={`${styles.optionButton} ${docType === 'invoice' ? styles.optionActive : ''}`}
                onClick={() => setDocType('invoice')}
              >
                Invoice
              </button>
            </div>
          </div>
          <div>
            <div className={styles.sectionLabel}>Service Type</div>
            <div className={styles.optionGrid}>
              <button
                className={`${styles.optionButton} ${serviceType === 'automotive' ? styles.optionActive : ''}`}
                onClick={() => setServiceType('automotive')}
              >
                Automotive
              </button>
              <button
                className={`${styles.optionButton} ${serviceType === 'residential' ? styles.optionActive : ''}`}
                onClick={() => setServiceType('residential')}
              >
                Residential
              </button>
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            {docType === 'quote'
              ? 'Quote Number (Optional - auto-generated if blank)'
              : 'Invoice Number (Optional - auto-generated if blank)'}
          </label>
          <input
            type="text"
            value={customNumber}
            onChange={(e) => setCustomNumber(e.target.value)}
            placeholder={docType === 'quote' ? 'QUOTE-2025-001' : 'INV-2025-001'}
            className={styles.textInput}
          />
        </div>
      </div>

      <div className={styles.quoteBuilder}>
        {/* Left Column */}
        <div>
          {/* Customer Info */}
          <div className={styles.builderSection}>
            <div className={styles.sectionLabel}>01 &mdash; Customer Information</div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Customer Name</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="John Doe" className={styles.textInput} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>{serviceType === 'automotive' ? 'Vehicle' : 'Property Address'}</label>
              <input type="text" value={customerVehicle} onChange={(e) => setCustomerVehicle(e.target.value)} placeholder={serviceType === 'automotive' ? '2024 Tesla Model 3' : '123 Main St'} className={styles.textInput} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Phone Number (Optional)</label>
              <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="(832) 555-1234" className={styles.textInput} />
            </div>
            {docType === 'invoice' && (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Warranty Number (Optional)</label>
                <input type="text" value={warrantyNumber} onChange={(e) => setWarrantyNumber(e.target.value)} placeholder="WAR-2025-001" className={styles.textInput} />
              </div>
            )}
          </div>

          {/* Film Type */}
          <div className={styles.builderSection}>
            <div className={styles.sectionLabel}>02 &mdash; Film Type {serviceType === 'residential' ? '(Default for new windows)' : ''}</div>
            {serviceType === 'automotive' ? (
              <div className={styles.optionGrid}>
                <button
                  className={`${styles.optionButton} ${filmType === 'regular' ? styles.optionActive : ''}`}
                  onClick={() => setFilmType('regular')}
                >
                  <div className={styles.filmName}>Regular Film</div>
                  <div className={styles.filmHeat}>54% Heat Rejection</div>
                </button>
                <button
                  className={`${styles.optionButton} ${filmType === 'ceramic' ? styles.optionActive : ''}`}
                  onClick={() => setFilmType('ceramic')}
                >
                  <div className={styles.filmName}>Ceramic Film</div>
                  <div className={styles.filmHeat}>84% Heat Rejection</div>
                </button>
              </div>
            ) : (
              <div className={styles.filmGridWide}>
                {Object.entries(FILM_TYPES).map(([key, info]) => (
                  <button
                    key={key}
                    className={`${styles.optionButton} ${filmType === key ? styles.optionActive : ''}`}
                    onClick={() => setFilmType(key)}
                  >
                    <div className={styles.filmName}>{info.name}</div>
                    <div className={styles.filmHeat}>{info.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Automotive Services */}
          {serviceType === 'automotive' && (
            <div className={styles.builderSection}>
              <div className={styles.sectionLabel}>03 &mdash; Select Services</div>

              {/* Front Windows */}
              <div className={styles.serviceItem}>
                <div className={styles.serviceCheckbox}>
                  <input type="checkbox" checked={frontWindows} onChange={(e) => setFrontWindows(e.target.checked)} id="frontWindows" />
                  <label htmlFor="frontWindows" className={styles.serviceName}>Front Windows (2)</label>
                </div>
                <div className={styles.servicePrice}>
                  {docType === 'invoice' && (
                    <div className={styles.percentField}>
                      <input type="number" value={percentFront} onChange={(e) => setPercentFront(parseFloat(e.target.value) || 0)} className={styles.priceInput} style={{ width: 60 }} />
                      <span className={styles.percentSign}>%</span>
                    </div>
                  )}
                  <div className={styles.priceField}>
                    $<input type="number" value={priceFront} onChange={(e) => setPriceFront(parseFloat(e.target.value) || 0)} className={styles.priceInput} />
                  </div>
                </div>
              </div>

              {/* Back Windows */}
              <div className={styles.serviceItem}>
                <div className={styles.serviceCheckbox}>
                  <input type="checkbox" checked={backWindows} onChange={(e) => setBackWindows(e.target.checked)} id="backWindows" />
                  <label htmlFor="backWindows" className={styles.serviceName}>Back Windows + Rear Glass</label>
                </div>
                <div className={styles.servicePrice}>
                  {docType === 'invoice' && (
                    <div className={styles.percentField}>
                      <input type="number" value={percentBack} onChange={(e) => setPercentBack(parseFloat(e.target.value) || 0)} className={styles.priceInput} style={{ width: 60 }} />
                      <span className={styles.percentSign}>%</span>
                    </div>
                  )}
                  <div className={styles.priceField}>
                    $<input type="number" value={priceBack} onChange={(e) => setPriceBack(parseFloat(e.target.value) || 0)} className={styles.priceInput} />
                  </div>
                </div>
              </div>

              {/* Windshield */}
              <div className={styles.serviceItem}>
                <div className={styles.serviceCheckbox}>
                  <input type="checkbox" checked={fullWindshield} onChange={(e) => setFullWindshield(e.target.checked)} id="fullWindshield" />
                  <label htmlFor="fullWindshield" className={styles.serviceName}>Full Windshield</label>
                </div>
                <div className={styles.servicePrice}>
                  {docType === 'invoice' && (
                    <div className={styles.percentField}>
                      <input type="number" value={percentWindshield} onChange={(e) => setPercentWindshield(parseFloat(e.target.value) || 0)} className={styles.priceInput} style={{ width: 60 }} />
                      <span className={styles.percentSign}>%</span>
                    </div>
                  )}
                  <div className={styles.priceField}>
                    $<input type="number" value={priceWindshield} onChange={(e) => setPriceWindshield(parseFloat(e.target.value) || 0)} className={styles.priceInput} />
                  </div>
                </div>
              </div>

              {/* Sunvisor */}
              <div className={styles.serviceItem}>
                <div className={styles.serviceCheckbox}>
                  <input type="checkbox" checked={sunvisor} onChange={(e) => setSunvisor(e.target.checked)} id="sunvisor" />
                  <label htmlFor="sunvisor" className={styles.serviceName}>Sunvisor Strip</label>
                </div>
                <div className={styles.servicePrice}>
                  {docType === 'invoice' && (
                    <div className={styles.percentField}>
                      <input type="number" value={percentSunvisor} onChange={(e) => setPercentSunvisor(parseFloat(e.target.value) || 0)} className={styles.priceInput} style={{ width: 60 }} />
                      <span className={styles.percentSign}>%</span>
                    </div>
                  )}
                  <div className={styles.priceField}>
                    $<input type="number" value={priceSunvisor} onChange={(e) => setPriceSunvisor(parseFloat(e.target.value) || 0)} className={styles.priceInput} />
                  </div>
                </div>
              </div>

              {/* Tint Removal */}
              <div className={styles.serviceItem}>
                <div className={styles.serviceCheckbox}>
                  <input type="checkbox" checked={removal} onChange={(e) => setRemoval(e.target.checked)} id="removal" />
                  <label htmlFor="removal" className={styles.serviceName}>Tint Removal</label>
                </div>
                <div className={styles.servicePrice}>
                  <div className={styles.priceField}>
                    $<input type="number" value={priceRemoval} onChange={(e) => setPriceRemoval(parseFloat(e.target.value) || 0)} className={styles.priceInput} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Residential Services */}
          {serviceType === 'residential' && (
            <div className={styles.builderSection}>
              <div className={styles.sectionLabel}>03 &mdash; Window Details</div>

              {windows.map((w) => (
                <div key={w.id} className={styles.windowItem}>
                  <div className={styles.windowHeader}>
                    <div className={styles.windowNumber}>Window {w.num}</div>
                    <button className={styles.removeWindow} onClick={() => removeWindow(w.id)}>Remove</button>
                  </div>
                  <div className={styles.windowGrid}>
                    <div className={styles.windowFull}>
                      <label className={styles.inputLabel}>Window/Room Name</label>
                      <input type="text" value={w.name} onChange={(e) => updateWindow(w.id, 'name', e.target.value)} placeholder="e.g., Living Room Window" className={styles.textInput} />
                    </div>
                    <div className={styles.windowFull}>
                      <label className={styles.inputLabel}>Film Type</label>
                      <select value={w.filmType} onChange={(e) => updateWindow(w.id, 'filmType', e.target.value)} className={styles.selectInput}>
                        {Object.entries(FILM_TYPES).map(([key, info]) => (
                          <option key={key} value={key}>{info.name} — {info.desc}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={styles.inputLabel}>Quantity</label>
                      <input type="number" value={w.quantity} onChange={(e) => updateWindow(w.id, 'quantity', parseFloat(e.target.value) || 0)} min="1" className={styles.textInput} />
                    </div>
                    <div>
                      <label className={styles.inputLabel}>Tint %</label>
                      <input type="number" value={w.percent} onChange={(e) => updateWindow(w.id, 'percent', parseFloat(e.target.value) || 0)} min="0" max="100" className={styles.textInput} />
                    </div>
                    <div className={styles.windowFull}>
                      <label className={styles.inputLabel}>Dimensions</label>
                      <div className={styles.dimensionGroup}>
                        <input type="number" value={w.width || ''} onChange={(e) => updateWindow(w.id, 'width', parseFloat(e.target.value) || 0)} placeholder="Width (in)" step="0.1" className={styles.textInput} />
                        <input type="number" value={w.height || ''} onChange={(e) => updateWindow(w.id, 'height', parseFloat(e.target.value) || 0)} placeholder="Height (ft)" step="0.1" className={styles.textInput} />
                      </div>
                    </div>
                    <div>
                      <label className={styles.inputLabel}>Price per Sq Ft</label>
                      <input type="number" value={w.pricePerSqft || ''} onChange={(e) => updateWindow(w.id, 'pricePerSqft', parseFloat(e.target.value) || 0)} step="0.01" className={styles.textInput} />
                    </div>
                    <div>
                      <label className={styles.inputLabel}>Total Price Override</label>
                      <input type="number" value={w.totalOverride || ''} onChange={(e) => updateWindow(w.id, 'totalOverride', parseFloat(e.target.value) || 0)} placeholder="Optional" step="0.01" className={styles.textInput} />
                    </div>
                  </div>
                  <div className={styles.calcDisplay}>
                    <div className={styles.calcLabel}>Calculated Total</div>
                    <div className={styles.calcValue}>
                      {w.sqft.toFixed(2)} sq ft x {w.quantity} windows = ${w.totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}

              <button className={styles.addWindowBtn} onClick={addWindow}>+ Add Window</button>

              <div style={{ marginTop: 25, paddingTop: 25, borderTop: '1px solid #222' }}>
                <div className={styles.serviceItem}>
                  <div className={styles.serviceCheckbox}>
                    <input type="checkbox" checked={residentialRemoval} onChange={(e) => setResidentialRemoval(e.target.checked)} id="resRemoval" />
                    <label htmlFor="resRemoval" className={styles.serviceName}>Tint Removal</label>
                  </div>
                  <div className={styles.servicePrice}>
                    <div className={styles.priceField}>
                      $<input type="number" value={priceResidentialRemoval} onChange={(e) => setPriceResidentialRemoval(parseFloat(e.target.value) || 0)} className={styles.priceInput} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Discount */}
          <div className={styles.discountSection}>
            <div className={styles.sectionLabel}>04 &mdash; Discount (Optional)</div>
            <div className={styles.discountInput}>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="0"
                min="0"
                max="100"
                className={styles.textInput}
                style={{ width: 80 }}
              />
              <span>% OFF</span>
            </div>
          </div>

          {/* Notes */}
          <div className={styles.builderSection}>
            <div className={styles.sectionLabel}>05 &mdash; Additional Notes</div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special notes, package details, or custom agreements..."
              className={styles.textarea}
            />
          </div>
        </div>

        {/* Right Column: Summary */}
        <div>
          <div className={styles.quoteSummary}>
            <div className={styles.sectionLabel}>Quote Summary</div>

            <div className={styles.customerInfoDisplay}>
              <p><strong>Customer:</strong> {customerName || '\u2014'}</p>
              <p><strong>{serviceType === 'automotive' ? 'Vehicle' : 'Property'}:</strong> {customerVehicle || '\u2014'}</p>
              {serviceType === 'automotive' && <p><strong>Film Type:</strong> {getFilmLabel()}</p>}
            </div>

            <div className={styles.selectedServices}>
              {services.length === 0 ? (
                <p className={styles.noServices}>No services selected</p>
              ) : (
                services.map((s, i) =>
                  s.isWindow ? (
                    <div key={i} className={styles.windowSummary}>
                      <div className={styles.windowSummaryName}>{s.name}</div>
                      <div className={styles.windowSummaryDetails}>
                        <div>Film: <span>{s.filmLabel}</span></div>
                        <div>Qty: <span>{s.quantity}</span></div>
                        <div>Dimensions: <span>{s.width.toFixed(2)}&quot; x {s.height.toFixed(2)}&apos;</span></div>
                        <div>Area: <span>{s.sqft.toFixed(2)} sq ft</span></div>
                        <div>Price/Sq Ft: <span>${s.pricePerSqft.toFixed(2)}</span></div>
                        {docType === 'invoice' && <div>Tint: <span>{s.percent}%</span></div>}
                      </div>
                      <div className={styles.windowSummaryPrice}>${s.price.toFixed(2)}</div>
                    </div>
                  ) : (
                    <div key={i} className={styles.summaryLine}>
                      <span className={styles.summaryLabel}>{s.name}</span>
                      <span className={styles.summaryValue}>${s.price.toFixed(2)}</span>
                    </div>
                  )
                )
              )}
            </div>

            <div className={styles.summaryLine}>
              <span className={styles.summaryLabel}>Subtotal</span>
              <span className={styles.summaryValue}>${subtotal.toFixed(2)}</span>
            </div>

            {disc > 0 && (
              <div className={styles.summaryLine}>
                <span className={styles.summaryLabel}>Discount ({disc}%)</span>
                <span className={styles.discountValue}>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className={`${styles.summaryLine} ${styles.totalLine}`}>
              <span>TOTAL</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.btnPrimary} onClick={generateQuote}>
                Generate {docType === 'quote' ? 'Quote' : 'Invoice'}
              </button>
              <button className={styles.btnSecondary} onClick={resetForm}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
