const ExcelJS = require("exceljs");

const createExcel = async (Directory, FileName) => {
  console.log("Creating Excel Workbook");
  const workbook = new ExcelJS.Workbook();

  console.log("Created Excel Workbook");
  console.log("Adding Worksheet");
  console.log(" ");

  // Create the worksheet
  const worksheet = workbook.addWorksheet(FileName);
  console.log("Added Excel Worksheet", FileName);

  // Save the worksheet to the specified output path
  await workbook.xlsx.writeFile(`${Directory}.xlsx`);
  console.log(`Workbook saved to: ${Directory}`);
  console.log(" ");

  return {
    Workbook: workbook,
    WorkSheet: worksheet,
    ExcelPath: `${Directory}.xlsx`,
  };
};

module.exports = { createExcel };
