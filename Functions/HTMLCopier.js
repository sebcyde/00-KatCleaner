const fs = require("fs").promises;

const HTMLCopier = async (fromPath, toPath) => {
  console.log("Copying HTML file");
  console.log("Copying from:", fromPath);
  console.log("Copying to:", toPath);
  console.log(" ");

  try {
    fs.copyFile(fromPath, `${toPath}.html`);
  } catch (error) {
    console.error("Error copying HTML:", error);
    return null;
  }
};

module.exports = { HTMLCopier };
