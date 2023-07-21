const { filterDirtyDirectories } = require("./Functions/filterDirectories");
const { transferDirectories } = require("./Functions/transferDirectories");
const { createSubDirectory } = require("./Functions/createSubDirectory");
const { createDirectory } = require("./Functions/createDirectory");
const { checkDirectory } = require("./Functions/checkDirectory");
const { getTestCompany } = require("./Functions/getTestCompany");
const { createLogFile } = require("./Functions/createLogFile");
const { DataTransfer } = require("./Functions/DataTransfer");
const { createExcel } = require("./Functions/createExcel");
const { getFileName } = require("./Functions/getFileName");
const { groupFiles } = require("./Functions/GroupFiles");
const { HTMLCopier } = require("./Functions/HTMLCopier");
const { updateLogs } = require("./Functions/updateLogs");
const { PDFCopier } = require("./Functions/PDFCopier");
const { CSVCopier } = require("./Functions/CSVCopier");
const { addToLog } = require("./Functions/addToLog");
const fs = require("fs");
const { setFilePermissions } = require("./Functions/setLogPermissions");

const WorkConverter = async (DirtyDirectory, CleanDirectory, LogDirectory, formattedDate) => {
  // console.log("Starting work converter");
  // console.log("Dirty Directory: ", DirtyDirectory);

  // Filtering files to be transformed
  const files = await fs.promises.readdir(DirtyDirectory, { withFileTypes: true });
  const DirtyDirectories = await filterDirtyDirectories(files);

  // Creating end result container
  // console.log("Creating clean container");
  const NewCleanDirectory = `${CleanDirectory}/${formattedDate}`;
  await checkDirectory(NewCleanDirectory);
  await createSubDirectory(NewCleanDirectory);

  // Initiate Logs
  const LogPath = await createLogFile(LogDirectory, formattedDate);

  const DirectoriesToClean = await transferDirectories(DirtyDirectories, DirtyDirectory);
  const GroupedFiles = await groupFiles(DirectoriesToClean);
  const failedTests = [];

  console.log("Directories to clean:", DirectoriesToClean.length);
  console.log("Grouped Files:", GroupedFiles.length);
  console.log(" ");

  let TestResults = {
    Total: GroupedFiles.length,
    Passed: 0,
    Failed: 0,
    Skipped: 0,
  };

  const processGroup = async (Group, index) => {
    try {
      // Get Group's company for folder organization
      const FileName = await getFileName(Group.PDF);
      const Company = await getTestCompany(Group);
      if (!Company) {
        TestResults.Skipped++;
        return;
      }

      // Create containing directory
      const sectionPath = await createDirectory(`${NewCleanDirectory}/${Company}/${Group.Section}`);
      const datePath = await createDirectory(`${sectionPath}/${FileName}`);
      const Directory = await createDirectory(`${datePath}/${formattedDate}`);
      console.log("Created containing directory");
      console.log(" ");

      // Copy over misc files
      await PDFCopier(Group.PDF, Directory);
      await HTMLCopier(Group.HTML, Directory);
      await CSVCopier(Group.CSV, Directory);

      // Create excel stuff
      const ExcelData = await createExcel(Directory, FileName);

      // Transfer Data to new excel files
      const Result = await DataTransfer(
        Group.CSV,
        Group.Section,
        ExcelData.Workbook,
        ExcelData.WorkSheet,
        ExcelData.ExcelPath
      );

      if (!Result) failedTests.push(Directory);

      await addToLog(LogPath, Group, Result);

      Result ? TestResults.Passed++ : TestResults.Failed++;
      console.log(" ");
      console.log(" ");
    } catch (error) {
      console.error("Error processing group:", error);
    }
  };

  for (const [index, Group] of GroupedFiles.entries()) {
    await processGroup(Group, index);
  }

  await updateLogs(TestResults, LogPath, failedTests);
  console.log("Results:", TestResults);
};

module.exports = { WorkConverter };
