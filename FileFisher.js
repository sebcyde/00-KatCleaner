const fs = require("fs").promises;
const path = require("path");

const FileFisher = async (directoryPath) => {
  try {
    const files = await fs.readdir(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const fileStats = await fs.stat(filePath);

      if (fileStats.isFile() && file.toLowerCase().endsWith(".csv")) {
        // Return the path of the PDF file
        let Company;
        if (filePath.includes("Electric")) {
          Company = "Electric";
        } else if (filePath.includes("Red")) {
          Company = "RedEngine";
        } else if (filePath.includes("Flight")) {
          Company = "FlightClub";
        }

        return { Company, Path: filePath };
      } else if (fileStats.isDirectory()) {
        // Recursively traverse subdirectories
        const foundPath = await FileFisher(filePath);
        if (foundPath) {
          return foundPath;
        }
      }
    }
  } catch (error) {
    console.error("Error in FileFisher:", error);
    return null;
  }
};

module.exports = { FileFisher };
