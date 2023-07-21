const fs = require("fs").promises;

const PDFCopier = async (fromPath, toPath) => {
  console.log("Copying PDF file");
  console.log("Copying from:", fromPath);
  console.log("Copying to:", toPath);
  console.log(" ");

  try {
    fs.copyFile(fromPath, `${toPath}.pdf`);
  } catch (error) {
    console.error("Error copying PDF:", error);
    return null;
  }
};

module.exports = { PDFCopier };
