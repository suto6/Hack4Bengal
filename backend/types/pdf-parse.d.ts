declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    numpages: number;
    info: any;
    metadata: any;
  }

  function parse(dataBuffer: Buffer, options?: any): Promise<PDFData>;
  
  export = parse;
}
