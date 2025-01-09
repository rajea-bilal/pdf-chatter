import { Document, Page, pdfjs } from 'react-pdf';
import { useState, useEffect, useRef } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ file }: { file: File }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);


  // used to update page number automatically when user scrolls
  const observer = useRef<IntersectionObserver>();

  // keep track of which PDF page are currently visible when the user scrolls
  const pageElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // when PDF successfully loads, set the number of pages
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    pageElementsRef.current = pageElementsRef.current.slice(0, numPages);
  }

  // The only purpose of this useEffect is so that the page number would update dynamically while scrolling
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      // when the page is 50% visible, update the page number
      threshold: 0.5, 
    };

    // create an instance of IntersectionObserver to track the visibility
    observer.current = new IntersectionObserver((entries) => {
      // when the page becomes visible enough
      // is the page visible in the viewport
      const visiblePage = entries.find(entry => entry.isIntersecting);
      if (visiblePage) {
        // update the page number we're on
        setPageNumber(Number(visiblePage.target.getAttribute('data-page-number')));
      }
    }, options);

    

    pageElementsRef.current.forEach((page) => {
      if (page) observer.current?.observe(page);
    });

    // clean up when the component unmounts
    return () => {
      if (observer.current) {
       observer.current.disconnect();
      }
    };
  }, [numPages]); 


  // Show the PDF
  return (
    <>
      <div className="h-full w-full">
        <span className="text-stone-300 text-md font-bold p-2">{pageNumber}/{numPages}</span>
     
      {/* PDF wrapper */}
      {/* scrollable div so the pdf is contained within a height */}
      <div className="w-full rounded-xl overflow-hidden bg-white/5 shadow-2xl p-2 overflow-y-auto max-h-[calc(100vh-200px)]">
        <Document 
        file={file} 
        onLoadSuccess={onDocumentLoadSuccess} 
        className="pdf-document">

          {/* loop through the number of pages and render each page */}
          {Array.from(new Array(numPages), (el, index) => (
            <div 
            ref={el => pageElementsRef.current[index] = el} 
            data-page-number={index + 1} 
            key={index}>
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={window.innerWidth * 0.8}
                className="rounded-xl overflow-hidden"
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </div>
          ))}
        </Document>
      </div>
       </div>
    </>
  );
};

export default PDFViewer;
