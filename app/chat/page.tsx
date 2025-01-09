
'use client';

import React, { useState } from 'react';
import Chat from '@/app/components/Chat';
import PdfUploader from '@/app/components/PdfUploader';
import PDFViewer from '@/app/components/PDFViewer';

export default function ChatPage() {
  const [pdfText, setPdfText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File>();

  return (
    <main className="p-4 md:p-8 flex-1 h-full">
      {/* main container for PDF and Chat */}
        <div className="flex flex-col items-center justify-center mx-auto lg:flex-row gap-8 px-4 md:p-0 max-w-7xl w-full h-full ">
          {/* PDF section */}
          <div className="flex-1 w-full md:w-1/2 h-full ">
            {pdfText ? 
              <PDFViewer file={selectedFile as File} />
              : <PdfUploader setPdfText={setPdfText} setSelectedFile={setSelectedFile} />
            }
          </div>
          {/* Chat section */}
          <div className="h-full flex-1 md:w-1/2 h-full ">
            <Chat pdfText={pdfText} />
          </div>
        </div>
    </main>
  );
}
    
    
 
   