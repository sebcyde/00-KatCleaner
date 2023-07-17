const fs = require("fs").promises;
const { FileFisher } = require("./FileFisher");
const { GetInput } = require("./GetInput");
const { PDFCopier } = require("./PDFCopier");
const { HTMLCopier } = require("./HTMLCopier");
const { ExcelCreator } = require("./ExcelCreator");
const { SubDirectoryCreator } = require("./SubdirectoryCreator");
const { DataTransfer } = require("./DataTransfer");

let DirtyDirectory = "C://Users/SebCy/Documents/Documents/Work/Katalon_Dirty";
let CleanDirectory = "C://Users/SebCy/Documents/Documents/Work/Katalon_Clean";

const currentDate = new Date();
const day = String(currentDate.getUTCDate()).padStart(2, "0");
const month = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
const year = currentDate.getUTCFullYear();
const formattedDate = `${day}${month}${year}`;

const Main = async () => {
  const location = await GetInput("Work or Home? ");
  if (location.toLowerCase() == "work") {
    DirtyDirectory =
      "C:/Users/sebastian.cyde/Documents/Other/Katalon/UK Site Tests/flightclub-testing/Reports";
    CleanDirectory = "C:/Users/sebastian.cyde/Documents/Other/KatReports";
  }

  const files = await fs.readdir(DirtyDirectory, { withFileTypes: true });
  const DirtyDirectories = files
    .filter((file) => file.isDirectory())
    .map((file) => file.name)
    .filter((name) => name.toLowerCase() != "self-healing");

  console.log("Dirty Directories:", DirtyDirectories);

  console.log("Creating clean container");
  const NewCleanDirectory = `${CleanDirectory}/${formattedDate}`;

  try {
    await fs.access(NewCleanDirectory);
    console.log("Clean directory already exists.");
  } catch (error) {
    await fs.mkdir(NewCleanDirectory);
    console.log("Created clean container");
  }

  console.log("Pre SDC:", NewCleanDirectory);

  await SubDirectoryCreator(NewCleanDirectory);

  let Res = {
    Total: 0,
    Passed: 0,
    Failed: 0,
  };
  for (const Dir of DirtyDirectories) {
    console.log("Current Directory:", Dir);
    try {
      const FileDetails = await FileFisher(`${DirtyDirectory}/${Dir}`);
      console.log("File Details:", FileDetails);

      const Company = FileDetails.Company;
      const FilePath = FileDetails.Path;

      if (Company) {
        const PDFPath = await PDFCopier(`${DirtyDirectory}/${Dir}`);
        const HTMLPath = await HTMLCopier(`${DirtyDirectory}/${Dir}`);

        console.log("Path:", FilePath);
        console.log("Company:", Company);

        console.log("Current Directory:", Dir);
        const directoryPath = `${NewCleanDirectory}/${Company}/${Dir}`;

        try {
          await fs.access(directoryPath);
          console.log("Directory already exists.");
        } catch (error) {
          await fs.mkdir(directoryPath);
          console.log("Directory created successfully.");
        }

        if (PDFPath) {
          const NewPDFPath = `${directoryPath}/${Company}${Dir}.pdf`;
          console.log("Copying PDF");
          await fs.copyFile(PDFPath, NewPDFPath);
        }

        if (HTMLPath) {
          const NewHTMLPath = `${directoryPath}/${Company}${Dir}.html`;
          console.log("Copying HTML");
          await fs.copyFile(HTMLPath, NewHTMLPath);
        }

        const ExcelThings = await ExcelCreator(directoryPath, Company, Dir);
        const TestResult = await DataTransfer(
          FilePath,
          ExcelThings.Workbook,
          ExcelThings.WorkSheet,
          ExcelThings.ExcelPath
        );

        console.log(" ");
        Res.Total++;
        // TestResult ? Res.Failed++ : Res.Passed++;
      } else {
        console.log("Current report doesnt follow specifications - Skipping");
      }
    } catch (error) {
      console.error("Error processing directory:", error);
    }
  }

  console.log(`Conversions complete: ${Res.Total}/${DirtyDirectories.length}`);
  // console.log(`Passed: ${Res.Passed}`);
  // console.log(`Failed: ${Res.Failed}`);

  console.log(" ");
};

Main();
