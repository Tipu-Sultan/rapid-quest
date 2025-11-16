import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { createWorker } from 'tesseract.js';
// Removed 'fs' as we are reading from a remote URL now

let worker = null;

async function getWorker() {
  if (!worker) {
    worker = await createWorker('eng', 1, {
      logger: () => {}, // Silence logs
      workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
      corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core.wasm.js',
      langPath: 'https://tessdata.projectnaptha.com/4.0.0',
    });
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
  }
  return worker;
}

/**
 * Downloads a file from a URL and extracts text based on MIME type.
 * @param {string} fileUrl - The remote URL of the file (e.g., Cloudinary URL).
 * @param {string} mimetype - The MIME type of the file.
 * @returns {Promise<string>} The extracted text content.
 */
export async function extractText(fileUrl, mimetype) {
  let dataBuffer;

  try {
    // Fetch the file content from the remote URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to download file from URL: ${response.status} ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    dataBuffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Node.js Buffer

  } catch (error) {
    console.error(`Download Error for ${fileUrl}:`, error);
    throw new Error('Failed to download file content.');
  }

  // Use the downloaded buffer for extraction
  if (mimetype === 'application/pdf') {
    const pdfData = await pdf(dataBuffer);
    return pdfData.text || '';
  }

  if (mimetype.includes('word')) {
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    return result.value || '';
  }

  // NOTE: Tesseract.js is more efficient when recognizing directly from a URL or ArrayBuffer,
  // but using the downloaded URL is safer for remote image indexing.
  if (mimetype.startsWith('image/')) {
    try {
      const worker = await getWorker();
      // Pass the remote URL directly for Tesseract to handle, or use the buffer if URL causes issues
      const { data: { text } } = await worker.recognize(fileUrl);
      await worker.terminate(); // Clean up after use
      return text || '';
    } catch (err) {
      console.error('OCR Error:', err.message);
      if (worker) await worker.terminate();
      return '';
    }
  }

  if (mimetype === 'text/plain') {
    return dataBuffer.toString('utf-8');
  }

  return '';
}