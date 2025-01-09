import React, { useState } from 'react';
import type { TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';

import { MdCloudUpload } from "react-icons/md";
import formatPage from '../utils/formatPage';

// this component handles PDF file uploads through
// 1. drag and drop
// 2. file input
// it processes the PDF file and extracts text from the first 4 pages


type Props = {
  setPdfText: React.Dispatch<React.SetStateAction<string>>;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | undefined>>;
};

const PdfUploader: React.FC<Props> = ({ setPdfText, setSelectedFile }) => {
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mergeTextContent = (textContent: TextContent) => {
    return textContent.items
      .map((item) => {
        const { str, hasEOL } = item as TextItem;
        return str + (hasEOL ? '\n' : '');
      })
      .join('');
  };

  const readPdf = async (pdfFile: File | undefined) => {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

    if (!pdfFile) return;

    // updating the file state with the PDF file so it can displayed in the PDFViewer component
    setSelectedFile(pdfFile);

    try {
      // convetr pdf file to array buffer
      const arrayBuffer = await pdfFile.arrayBuffer();
      // load pdf file
      const loadingPDF = pdfjs.getDocument(arrayBuffer)
      // wait for the pdf file to finish loading
      const pdf = await loadingPDF.promise;
      // get the number of pages in the pdf file
      const numPages = pdf.numPages;
      // if the number of pages is greater than 4, alert the user
      if (numPages > 4) {
        alert('Please note that due to the limitations of our free service, only the first 4 pages will be considered for processing.');
      }
      // loop through the pages and extract the text
      // process the first 4 pages
      for(let i = 1; i <= Math.min(numPages, 4); i++) {
        // get the current page
        const page = await pdf.getPage(i);
        // extract text from the page
        const textContent = await page.getTextContent();
        // convert text content to readable format
        const extractedText = mergeTextContent(textContent);

        // update the pdf text state with the extracted text
        setPdfText(currentText => {
          // if this is the first page, add the page number and extracted text
          if (currentText == '')  {
            return formatPage(i, extractedText);
          }
          // if this is not the first page, add the page number and extracted text to the current text
          return currentText + formatPage(i, extractedText);
        });
      }

    } catch(error) {
      console.error(`Error during PDF loading: ${error}`);
      setError('There was an error reading the PDF. Please try again.');
    }
   
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    // reset the pdf, error and loading state to true so spinner is shown
    setPdfText('');
    setError('');
    setIsLoading(true);

    try {
      // get the dropped items
      const items = event.dataTransfer.items;

      // check if exactly one file was dropped
      if (!items || items.length !== 1) {
        throw new Error('Please drop a single file.');
      }
      const item = items[0];

      // check if its a PDF file
      if (item.kind !== 'file' || item.type !== 'application/pdf') {
        throw new Error('Please drop a single PDF file.');
      }
      // get the actual file
      const file = item.getAsFile();

      if (!file) {
        throw new Error("The PDF wasn't uploaded correctly.");
      }

      // process the pdf
      await readPdf(file);
    } catch (error) {
      setError('There was an error reading the PDF. Please try again.');
    } finally {
      setIsLoading(false);
      setIsDragOver(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleButtonUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setIsLoading(true);
    setPdfText('');

    try {
      // get the file from the file input
      const file = event.target.files?.[0];
      if (!file) {
        setError("The PDF wasn't uploaded correctly.");
        setIsLoading(false);
        return;
      }

      // process the pdf
      await readPdf(file);
    } catch (error) {
      setError('There was an error reading the resume. Please try again.');
    }
  };

  return (
    <>
      <div
        className={`h-full w-full flex flex-col items-center justify-center p-8 
        border-2 border-dashed border-orange-100/70 rounded-lg transition-colors duration-200 ease-in-out
        cursor-pointer
        ${isDragOver ? 'border-green-300 bg-green-300/10'
          : 'border-gray-300 hover:border-green-300/50'
         }
        `}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e)}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => handleDragOver(e)}
        onDragEnter={(e: React.DragEvent<HTMLDivElement>) => handleDragEnter(e)}
        onDragLeave={(e: React.DragEvent<HTMLDivElement>) => handleDragLeave(e)}
      >
        {/* show loading spinner or upload button */}
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <>
          {/* hidden file input, triggered by label click */}
            <input
              type="file"
              id="file-upload"
              onChange={handleButtonUpload}
              accept="application/pdf"
              hidden
            />
            {/* label that acts as the upload button */}
            <label htmlFor="file-upload" className={`font-medium rounded-full p-2 cursor-pointer flex items-center gap-2 px-6 py-3 bg-orange-100/50 text-stone-300 transition-colors duration-200 ease-in-out hover:bg-orange-100/40`}>
              <MdCloudUpload /> Upload your PDF
            </label>
          </>
        )}
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </>
  );
};

export default PdfUploader;