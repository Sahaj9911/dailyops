/**
 * Parse structured invoice data from raw OCR text.
 * Uses regex patterns to extract supplier, amount, date, GST, and invoice number.
 */

export function parseInvoiceText(rawText) {
  const text = rawText || '';
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const gstData = extractGST(text);

  return {
    supplier: extractSupplier(text, lines),
    amount: extractAmount(text),
    gst: gstData.total,
    cgst: gstData.cgst,
    sgst: gstData.sgst,
    igst: gstData.igst,
    date: extractDate(text),
    invoiceNo: extractInvoiceNo(text),
    category: guessCategory(text),
    rawText: text,
  };
}

function extractSupplier(text, lines) {
  // Look for lines near "from", "supplier", "vendor", "bill to", company-like names
  const patterns = [
    /(?:from|supplier|vendor|seller|billed?\s*by)[:\s]*([A-Z0-9][A-Za-z0-9\s&.,'-]+)/i,
    /(?:M\/s|Messrs)[.\s]*([A-Z0-9][A-Za-z0-9\s&.,'-]+)/i,
    /(?:company|firm)[:\s]*([A-Z0-9][A-Za-z0-9\s&.,'-]+)/i,
    /([A-Z][A-Z\s&]+(?:LOGISTICS|FABRICS|TEXTILES|ENTERPRISES|TRADERS|MILLS|COMPANY|CO\.|LTD|PVT|LLP|INC))/i
  ];
  for (const pat of patterns) {
    const match = text.match(pat);
    if (match) return match[1].trim().substring(0, 60);
  }
  // Fallback: first line that looks like a company name (capitalized or all caps, 2+ words)
  for (const line of lines.slice(0, 10)) {
    const cleanLine = line.trim();
    if (/^[A-Z0-9][a-zA-Z0-9]+(\s+[A-Z0-9][a-zA-Z0-9]+)+/.test(cleanLine) && cleanLine.length < 60 && !/invoice|date|tax|gst|total|amount|original|recipient/i.test(cleanLine)) {
      return cleanLine.substring(0, 60);
    }
  }
  return '';
}

function extractAmount(text) {
  // The grand total of an invoice is almost universally the largest currency value
  // present on the entire document. Scanning for the absolute max is the most robust approach.
  let maxAmount = 0;
  const allNumbers = text.match(/[0-9]{1,3}(?:,[0-9]{3})*\.\d{2}/g) || [];
  for (const n of allNumbers) {
    const val = parseFloat(n.replace(/,/g, ''));
    if (!isNaN(val) && val > maxAmount) maxAmount = val;
  }
  return maxAmount;
}

function extractGST(text) {
  const findNextAmount = (label) => {
    // Find label, then skip up to 60 characters and grab the very first decimal number
    const regex = new RegExp(`\\b${label}\\b[\\s\\S]{0,60}?([0-9]{1,3}(?:,[0-9]{3})*\\.\\d{2})`, 'i');
    const match = text.match(regex);
    if (match) return parseFloat(match[1].replace(/,/g, ''));
    return 0;
  };

  let cgst = findNextAmount('cgst');
  let sgst = findNextAmount('sgst');
  let igst = findNextAmount('igst');
  let totalGst = cgst + sgst + igst;

  // Fallback: If the PDF text objects are completely scrambled (e.g. labels at the bottom, numbers at the top),
  // regex distance matching fails. We use mathematical deduction based on Indian GST laws.
  // Grand Total = Taxable Amount + GST (which is either 100% IGST or 50/50 CGST/SGST).
  if (totalGst === 0) {
    const allNumbers = (text.match(/[0-9]{1,3}(?:,[0-9]{3})*\.\d{2}/g) || []).map(n => parseFloat(n.replace(/,/g, '')));
    if (allNumbers.length >= 2) {
      const sorted = [...new Set(allNumbers)].sort((a, b) => b - a);
      const grandTotal = sorted[0];
      const taxableAmount = sorted[1];
      const calculatedGst = grandTotal - taxableAmount;

      let foundFullGst = 0;
      let foundHalfGst = 0;

      for (const num of allNumbers) {
        // Allow up to 2 rupees difference for round-offs
        if (num > 0 && Math.abs(num - calculatedGst) <= 2.0) foundFullGst = num;
        if (num > 0 && Math.abs(num - (calculatedGst / 2)) <= 1.0) foundHalfGst = num;
      }

      if (foundFullGst > 0) {
        igst = foundFullGst;
        totalGst = foundFullGst;
      } else if (foundHalfGst > 0) {
        cgst = foundHalfGst;
        sgst = foundHalfGst;
        totalGst = foundHalfGst * 2;
      }
    }
  }

  // Generic fallback if math also fails
  if (totalGst === 0) {
    const genericGst = findNextAmount('gst amount') || findNextAmount('total tax') || findNextAmount('total gst');
    return { total: genericGst, cgst: genericGst / 2, sgst: genericGst / 2, igst: 0 };
  }

  return { total: totalGst, cgst, sgst, igst };
}

function extractDate(text) {
  // Common date patterns
  const patterns = [
    /(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/,
    /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*,?\s*\d{2,4})/i,
    /(?:date)[:\s]*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i,
    /(?:date)[:\s]*(\d{1,2}\s+\w+\s+\d{4})/i,
  ];
  for (const pat of patterns) {
    const match = text.match(pat);
    if (match) {
      try {
        const d = new Date(match[1]);
        if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
      } catch {}
      return match[1];
    }
  }
  return new Date().toISOString().split('T')[0];
}

function extractInvoiceNo(text) {
  const patterns = [
    /(?:invoice\s*(?:no|number|#|id))[.:\s]*([A-Z0-9\-/]+)/i,
    /(?:inv\s*(?:no|#))[.:\s]*([A-Z0-9\-/]+)/i,
    /(?:bill\s*(?:no|number|#))[.:\s]*([A-Z0-9\-/]+)/i,
    /(INV[\-/]?\d{3,})/i,
  ];
  for (const pat of patterns) {
    const match = text.match(pat);
    if (match) return match[1].trim();
  }
  return `INV-${Math.floor(Math.random() * 9000) + 1000}`;
}

function guessCategory(text) {
  const t = text.toLowerCase();
  const categoryKeywords = {
    Fabric: ['fabric', 'cotton', 'linen', 'denim', 'silk', 'textile', 'cloth', 'yarn', 'thread', 'polyester', 'nylon', 'wool'],
    Hardware: ['zipper', 'button', 'buckle', 'rivet', 'snap', 'hardware', 'machinery', 'parts', 'equipment', 'metal', 'hook'],
    Labor: ['labor', 'labour', 'wages', 'salary', 'worker', 'manpower', 'stitching', 'tailoring'],
    Logistics: ['logistics', 'shipping', 'freight', 'transport', 'delivery', 'courier', 'cargo'],
  };
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(k => t.includes(k))) return cat;
  }
  return 'Miscellaneous';
}
