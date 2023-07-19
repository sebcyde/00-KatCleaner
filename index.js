const fs = require("fs").promises;
const { FileFisher } = require("./FileFisher");
const { GetInput } = require("./GetInput");
const { PDFCopier } = require("./PDFCopier");
const { HTMLCopier } = require("./HTMLCopier");
const { ExcelCreator } = require("./ExcelCreator");
const { SubDirectoryCreator } = require("./SubdirectoryCreator");
const { DataTransfer } = require("./DataTransfer");
const { GroupFiles } = require("./GroupFiles");

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
  await SubDirectoryCreator(NewCleanDirectory);
  fs.appendFile(LogPath, `Date of execution: ${formattedDate}\n\n`);

  let Res = {
    Total: 0,
    Passed: 0,
    Failed: 0,
    Skipped: 0,
  };

  console.log("Top Level Directories:", DirtyDirectories);
  let transferredDirectories = 0;
  const DirectoriesToClean = [];
  let failedTests = [];

  // TODO - FIX FROM HERE

  // Remove all nested directories that have files in them into DirectoriesToClean
  const TransferDirectories = async () => {
    for (const Dir of DirtyDirectories) {
      console.log("Currently transferring:", Dir);
      try {
        // Get files from all directories in each top level directory
        const AllFileDetails = await FileFisher(`${DirtyDirectory}/${Dir}`);
        console.log("All File Details:", AllFileDetails.length);

        AllFileDetails.forEach((FileDetails) => {
          // console.log("FD:", FileDetails);
          DirectoriesToClean.push(FileDetails);
        });
        transferredDirectories++;
      } catch (error) {
        console.error("Error transferring directory from top level directory:", error);
      }
    }
  };

  await TransferDirectories();
  const GroupedFiles = await GroupFiles(DirectoriesToClean);

  console.log(" ");
  console.log("Directories to clean:", DirectoriesToClean.length);
  console.log("Grouped Files:", GroupedFiles.length);

  GroupedFiles.forEach((Group) => {
    console.log(Group);
    console.log(" ");
  });

  // Clean and convert the transferred directories
  // DirectoriesToClean.forEach((dir) => {
  // console.log(dir);
  // });

  // let i = 0;
  // DirectoriesToClean.forEach(async (Dir) => {
  //   // Individual Test Details
  //   const TestCompany = Dir.Company;
  //   const CSVFilePath = Dir.Path;
  //   const FileName = Dir.Name;

  //   // Getting other related  docs
  //   const ExistingPDFPath = await PDFCopier(`${DirtyDirectory}/${Dir}/${Company}`);
  //   const ExistingHTMLPath = await HTMLCopier(`${DirtyDirectory}/${Dir}/${Company}`);

  //   // Creating new directory for the created directories to go into
  //   const NewBaseDirectoryPath = `${NewCleanDirectory}/${Company}/${Dir}`;
  //   console.log("New directory:", NewBaseDirectoryPath);
  //   console.log("New Clean Directory: ", NewCleanDirectory);
  //   console.log(" ");

  //   //
  //   //
  //   //

  //   // If new directory already exists, dont recreate it. Put new directories in it
  //   try {
  //     await fs.access(NewBaseDirectoryPath);
  //     console.log("New Base Directory already exists at: ", NewBaseDirectoryPath);
  //   } catch (error) {
  //     await fs.mkdir(NewBaseDirectoryPath);
  //     console.log("New Base directory created successfully at: ", NewBaseDirectoryPath);
  //   }
  //   console.log(" ");

  //   // If there is a pdf file to copy over
  //   if (ExistingPDFPath) {
  //     console.log("Copying PDF");
  //     const NewPDFPath = `${NewBaseDirectoryPath}/${Company}${Dir}/${Name}.pdf`;
  //     try {
  //       await fs.copyFile(`${ExistingPDFPath}/${Name}`, NewPDFPath);

  //       console.log(" New PDF file copied over successfully");
  //     } catch (error) {
  //       console.log("Error copying PDF over:", error);
  //     }
  //   }

  //   // If there is a html file to copy over
  //   if (ExistingHTMLPath) {
  //     console.log("Copying HTML");
  //     const NewHTMLPath = `${directoryPath}/${Company}${Dir}/${Name}.html`;
  //     try {
  //       await fs.copyFile(`${ExistingHTMLPath}/${Name}`, NewHTMLPath);
  //       console.log("New HTML file copied successfully");
  //     } catch (error) {
  //       console.log("Error copying HTML over:", error);
  //     }
  //   }
  //   console.Log(" ");

  //   //
  //   //

  //   // New location for other documents in each test suites folder
  //   console.log(`Creating excel workbook at: ${Dir}/${Name}`);
  //   const ExcelThings = await ExcelCreator(directoryPath, Company, `${Dir}/${Name}`);
  //   console.Log(" ");

  //   //
  //   //

  //   // Transfer data from existing CSV file to the new workbook
  //   console.log("Copying CSV data to new excel workbook");
  //   const TestResult = await DataTransfer(
  //     FilePath,
  //     ExcelThings.Workbook,
  //     ExcelThings.WorkSheet,
  //     ExcelThings.ExcelPath
  //   );

  //   console.Log(" ");

  //   console.log("Result:", TestResult);
  //   console.log(" ");
  //   Res.Total++;
  //   TestResult ? Res.Passed++ : Res.Failed++;
  //   TestResult ? "" : failedTests.push(`Failed ${Company} Test: - ${directoryPath}/${Company}`);

  //   // Updating log file
  //   let XPath = ExcelThings.ExcelPath;
  //   fs.appendFile(LogPath, `Report Directory - ${directoryPath}.\n`);
  //   fs.appendFile(LogPath, `PDF Path - ${PDFPath ? PDFPath : ""}.\n`);
  //   fs.appendFile(LogPath, `HTML Path - ${HTMLPath ? HTMLPath : ""}.\n`);
  //   fs.appendFile(LogPath, `Excel Path - ${XPath ? XPath : ""}.\n`);
  //   fs.appendFile(LogPath, `Test result: - ${TestResult ? "PASSED" : "FAILED"}.\n\n`);

  //   i++;
  //   Res.Total++;

  //   // console.log("Current report doesnt follow specifications - Skipping");
  //   // Res.Skipped++;
  // });

  // Log stuff
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
