// lib/indexer.js
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { createWorker } from 'tesseract.js';
import fs from 'fs';

let worker = null;

async function getWorker() {
  if (!worker) {
    worker = await createWorker('eng', 1, {
      logger: () => {}, // Silence logs
      workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
      corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core.wasm.js',
      langPath: 'https://tessdata.projectnaptha.com/4.0.0',
    });
    // Critical: Explicit load in Node.js
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
  }
  return worker;
}

export async function extractText(filePath, mimetype) {
  const dataBuffer = fs.readFileSync(filePath);

  if (mimetype === 'application/pdf') {
    const pdfData = await pdf(dataBuffer);
    return pdfData.text || '';
  }

  if (mimetype.includes('word')) {
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    return result.value || '';
  }

  if (mimetype.startsWith('image/')) {
    try {
      const worker = await getWorker();
      const { data: { text } } = await worker.recognize(filePath);
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