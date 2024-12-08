chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractPDFText") {
      (async () => {
        try {
          const pdfjsModule = await import(chrome.runtime.getURL('pdf/pdf.mjs'));
  
          const pdfjsLib = pdfjsModule;
          pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdf/pdf.worker.mjs');
  
          const text = await extractPDFText(document.location.href, pdfjsLib);
          sendResponse({ pdfText: text });
        } catch (err) {
          console.error("Error extracting PDF text:", err);
          sendResponse({ pdfText: null });
        }
      })();
      return true; // Keep the message channel open
    }
  });
  
  async function extractPDFText(pdfUrl, pdfjsLib) {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to load PDF from URL: ${pdfUrl}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = "";
  
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      fullText += pageText + "\n";
    }
  
    return fullText.trim();
  }
  