const formatPage = (pageNumber: number, pageText: string) => {
  return `
  Page ${pageNumber}:
  
  ${pageText}
  -----------
  `;
}

export default formatPage;