const fs = require("fs").promises;

const CSVCopier = async (fromPath, toPath) => {
  console.log("Copying CSV file");
  console.log("Copying from:", fromPath);
  console.log("Copying to:", toPath);
  console.log(" ");

  try {
    fs.copyFile(fromPath, `${toPath}.CSV`);
  } catch (error) {
    console.error("Error copying CSV:", error);
    return null;
  }
};

module.exports = { CSVCopier };
