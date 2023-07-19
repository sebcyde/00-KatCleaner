const fs = require("fs").promises;
const path = require("path");

const PDFCopier = async (directoryPath) => {
  try {
    const files = await fs.readdir(directoryPath);

    console.log("Files in PDF copier:", files);
    console.log(" ");
    console.log(" ");
    console.log(" ");

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const fileStats = await fs.stat(filePath);

      if (fileStats.isFile() && file.toLowerCase().endsWith(".pdf")) {
        return filePath;
      } else if (fileStats.isDirectory()) {
        // Recursively traverse subdirectories
        const foundPath = await PDFCopier(filePath);
        if (foundPath) {
          // Return the path if found in a subdirectory
          return foundPath;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error in PDFCopier:", error);
    return null;
  }
};

module.exports = { PDFCopier };
