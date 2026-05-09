export async function extractTextFromPDF(file, onProgress) {
  try {
    // Dynamically load pdfjs from CDN to avoid Next.js build/worker issues
    if (!window.pdfjsLib) {
      if (onProgress) onProgress(10);
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    if (onProgress) onProgress(20);
    const pdfjsLib = window.pdfjsLib;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    if (onProgress) onProgress(50);
    
    let fullText = '';
    // Only parse first 3 pages
    const numPages = Math.min(pdf.numPages, 3);
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
      
      if (onProgress) onProgress(50 + Math.round((i / numPages) * 40));
    }
    
    if (onProgress) onProgress(100);
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
}

