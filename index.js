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

let LogDirectory = `C://Users/SebCy/Documents/Documents/Work/Katalon_Cleaner_Logs`;

const Main = async () => {
  const location = await GetInput("Work or Home? ");
  if (location.toLowerCase() == "work") {
    DirtyDirectory =
      "C:/Users/sebastian.cyde/Documents/Other/Katalon/UK Site Tests/flightclub-testing/Reports";
    CleanDirectory = "C:/Users/sebastian.cyde/Documents/Other/KatReports";
    LogDirectory = `C:/Users/sebastian.cyde/Documents/Other/CleanerLogs/`;
  }

  let LogPath = `${LogDirectory}/${formattedDate}.txt`;

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

  async function createLogFile() {
    try {
      await fs.access(LogDirectory);
      console.log("Log directory already exists.");
    } catch (error) {
      try {
        await fs.mkdir(LogDirectory, { recursive: true });
        console.log("Log directory created successfully.");
      } catch (error) {
        console.error("Error creating log directory:", error);
        return; // Abort further processing if directory creation fails
      }
    }

    try {
      await fs.writeFile(LogPath, "");
      console.log("Log file created successfully.");
    } catch (error) {
      console.error("Error creating log file:", error);
    }
  }

  await createLogFile();

  console.log("Pre SDC:", NewCleanDirectory);

  await SubDirectoryCreator(NewCleanDirectory);

  let Res = {
    Total: 0,
    Passed: 0,
    Failed: 0,
    Skipped: 0,
  };
  let failedTests = [];
  let i = 0;
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

        console.log("Result:", TestResult);
        console.log(" ");
        Res.Total++;
        TestResult ? Res.Passed++ : Res.Failed++;
        TestResult ? "" : failedTests.push(`Failed Test: ${i + 1} - ${directoryPath}/${Company}`);

        // Updating log file
        let XPath = ExcelThings.ExcelPath;
        fs.appendFile(LogPath, `Date of execution: ${formattedDate}\n\n`);
        fs.appendFile(LogPath, `${Company} - ${directoryPath}.\n`);
        fs.appendFile(LogPath, `PDF Path - ${PDFPath ? PDFPath : ""}.\n`);
        fs.appendFile(LogPath, `HTML Path - ${HTMLPath ? HTMLPath : ""}.\n`);
        fs.appendFile(LogPath, `Excel Path - ${XPath ? XPath : ""}.\n`);
        fs.appendFile(LogPath, `Test result: - ${TestResult ? "PASSED" : "FAILED"}.\n\n`);

        i++;
      } else {
        console.log("Current report doesnt follow specifications - Skipping");
        Res.Skipped++;
        Res.Total++;
      }
    } catch (error) {
      console.error("Error processing directory:", error);
    }
  }

  console.log(`Conversions complete: ${Res.Total}/${Res.Total}`);
  console.log(`Skipped: ${Res.Skipped}`);
  console.log(`Passed: ${Res.Passed}`);
  console.log(`Failed: ${Res.Failed}`);
  console.log(" ");

  console.log("Updating Logs..");

  fs.appendFile(LogPath, "\n");
  fs.appendFile(LogPath, `Conversions complete: ${Res.Total}/${Res.Total}\n`);
  fs.appendFile(LogPath, `Skipped: ${Res.Skipped}\n`);
  fs.appendFile(LogPath, `Passed: ${Res.Passed}\n`);
  fs.appendFile(LogPath, `Failed: ${Res.Failed}\n`);
  fs.appendFile(LogPath, "\n");

  failedTests.forEach((log) => {
    fs.appendFile(LogPath, `${log}\n`);
  });
  console.log("Logs Updated.");
  console.log("");
};

Main();
