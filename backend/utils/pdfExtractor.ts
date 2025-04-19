// utils/pdfExtractor.ts
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';

/**
 * Extract text from a PDF file
 * @param filePath Path to the PDF file
 * @returns Extracted text from the PDF
 */
export const extractTextFromPDF = async (filePath: string): Promise<string> => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};
