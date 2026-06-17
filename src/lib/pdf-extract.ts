import PDFParser from "pdf2json";

/**
 * Extract text from a PDF buffer
 * @param buffer The PDF file buffer
 * @returns The extracted text from the PDF
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (error: Error) => {
      console.error("PDF parsing error:", error);
      reject(
        new Error(
          "Failed to extract text from PDF. The file may be corrupted or unsupported."
        )
      );
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        let text = "";

        if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
          for (const page of pdfData.Pages) {
            if (page.Texts && Array.isArray(page.Texts)) {
              for (const textItem of page.Texts) {
                if (textItem.R && Array.isArray(textItem.R)) {
                  for (const run of textItem.R) {
                    if (run.T) {
                      // Decode the text (it's URL-encoded)
                      text += decodeURIComponent(run.T);
                    }
                  }
                }
                text += " ";
              }
            }
            text += "\n";
          }
        }

        resolve(text.trim());
      } catch (error) {
        console.error("Error processing PDF data:", error);
        reject(
          new Error(
            "Failed to extract text from PDF. The file may be corrupted or unsupported."
          )
        );
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}
