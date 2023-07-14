const fs = require("fs").promises;
const path = require("path");

const HTMLCopier = async (directoryPath) => {
  try {
    const files = await fs.readdir(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const fileStats = await fs.stat(filePath);

      if (fileStats.isFile() && file.toLowerCase().endsWith(".html")) {
        return filePath;
      } else if (fileStats.isDirectory()) {
        // Recursively traverse subdirectories
        const foundPath = await HTMLCopier(filePath);
        if (foundPath) {
          // Return the path if found in a subdirectory
          return foundPath;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error in HTMLCopier:", error);
    return null;
  }
};

module.exports = { HTMLCopier };
