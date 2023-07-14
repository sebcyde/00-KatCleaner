const ExcelJS = require("exceljs");

const ExcelCreator = async (Path, Company, Dir) => {
  console.log(" ");
  console.log(`Excel Path: ${Path}`);
  console.log("Creating Excel Workbook");
  const workbook = new ExcelJS.Workbook();
  console.log("Created Excel Workbook");
  console.log("Adding Excel Worksheet");

  const worksheet = workbook.addWorksheet(`${Company}${Dir}`);
  console.log("Added Excel Worksheet", `${Company}${Dir}`);

  // Save the workbook to the specified output path
  await workbook.xlsx.writeFile(`${Path}/${Company}${Dir}.xlsk`);
  console.log(`Workbook saved to: ${Path}/${Company}${Dir}`);
  console.log(" ");
  return {
    Workbook: workbook,
    WorkSheet: worksheet,
    ExcelPath: `${Path}/${Company}${Dir}.xlsk`,
  };
};

module.exports = { ExcelCreator };
