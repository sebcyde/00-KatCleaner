const { FileDataReader } = require("./FileDataReader");
const userName = "Sebastian Cyde";

const DataTransfer = async (filePath, workbook, worksheet, excelPath) => {
  console.log("Starting data transfer");

  const currentDate = new Date();
  const day = String(currentDate.getUTCDate()).padStart(2, "0");
  const month = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
  const year = currentDate.getUTCFullYear();

  // Read the HTML file data
  const fileData = await FileDataReader(filePath);

  if (fileData) {
    // fileData.forEach((dataObject, i) => {
    // 	console.log(`CSV Record: ${i + 1}`, dataObject);
    // 	console.log(' ');
    // });

    console.log("Populating Excel Worksheet");

    fileData.forEach((dataObject, i) => {
      console.log(`Writing Record: ${i + 1}`);
      worksheet.getCell(`A${i + 3}`).value = dataObject[0];
      worksheet.getCell(`B${i + 3}`).value = dataObject[4];
      worksheet.getCell(`C${i + 3}`).value = dataObject[5];
      worksheet.getCell(`D${i + 3}`).value = dataObject[6];
      worksheet.getCell(`E${i + 3}`).value = dataObject[7];
    });

    // Signoff - user signatures etc
    console.log(" ");
    console.log("Signing Sheet");

    worksheet.getCell("A1").value = `Signed By: ${userName}`;
    worksheet.getCell("B1").value = `Creation Date: ${day}/${month}/${year}`;

    console.log(" ");
    console.log("Data transfer complete");
    console.log("Saving...");

    // Save the workbook to the specified output path
    await workbook.xlsx.writeFile(excelPath);
    console.log("Workbook saved to", excelPath);
  } else {
    console.error("Failed to read HTML data");
  }
};

module.exports = { DataTransfer };