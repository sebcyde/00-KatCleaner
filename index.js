const { GetInput } = require("./Functions/GetInput");
const { HomeConverter } = require("./HomeConverter");
const { WorkConverter } = require("./WorkConverter");

const currentDate = new Date();
const day = String(currentDate.getUTCDate()).padStart(2, "0");
const month = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
const year = currentDate.getUTCFullYear();
const formattedDate = `${day}${month}${year}`;

const Main = async () => {
  const location = await GetInput("Work or Home? ");

  location.toLowerCase() == "work"
    ? await WorkConverter(
        "C:/Users/sebastian.cyde/Documents/Other/Katalon/UK Site Tests/flightclub-testing/Reports",
        "C:/Users/sebastian.cyde/Documents/Other/KatReports",
        `C:/Users/sebastian.cyde/Documents/Other/CleanerLogs`,
        formattedDate
      )
    : await HomeConverter(
        "C://Users/SebCy/Documents/Documents/Work/Katalon_Dirty",
        "C://Users/SebCy/Documents/Documents/Work/Katalon_Clean",
        `C://Users/SebCy/Documents/Documents/Work/Katalon_Cleaner_Logs`,
        formattedDate
      );

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
};

Main();
