// mjs module adjustments
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// importing dependencies
const fs = require('fs');
const pdfjs = require('pdfjs-dist');
const { createCanvas } = require('canvas');

// PDF.js worker source file (download or build this file)
// pdfjs.GlobalWorkerOptions.workerSrc = 'path/to/pdf.worker.js';

// asynchronous function used to convert pdf to images
export async function convertPDFToImages(pdfFilePath, outputDirectory) {
  const data = new Uint8Array(fs.readFileSync(pdfFilePath));
  const pdf = await pdfjs.getDocument(data).promise;

  // looping for every single pdf page
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2.0 });

    // specifying required pdf part seeking
    const canvas = createCanvas(viewport.width, viewport.height);

    const context = canvas.getContext('2d');

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    const imageData = await page.render(renderContext).promise;
    const imageBuffer = canvas.toBuffer('image/jpeg');

    const imageFileName = `${outputDirectory}/page_${pageNumber}.jpg`;
    fs.writeFileSync(imageFileName, imageBuffer);

    // logging the process by page
    console.log(`Page ${pageNumber} converted to ${imageFileName}`);
  }
}