const { filterDirtyDirectories } = require("./Functions/filterDirectories");
const { transferDirectories } = require("./Functions/transferDirectories");
const { createSubDirectory } = require("./Functions/createSubDirectory");
const { checkDirectory } = require("./Functions/checkDirectory");
const { createLogFile } = require("./Functions/createLogFile");
const { createExcel } = require("./Functions/createExcel");
const { groupFiles } = require("./Functions/GroupFiles");
const fs = require("fs");
const { getTestCompany } = require("./Functions/getTestCompany");
const { PDFCopier } = require("./Functions/PDFCopier");
const { createDirectory } = require("./Functions/createDirectory");
const { getFileName } = require("./Functions/getFileName");
const { HTMLCopier } = require("./Functions/HTMLCopier");
const { CSVCopier } = require("./Functions/CSVCopier");
const { DataTransfer } = require("./Functions/DataTransfer");

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

  let TestResults = {
    Total: DirtyDirectories.length,
    Passed: 0,
    Failed: 0,
    Skipped: 0,
  };

  // console.log("Top Level Directories:", DirtyDirectories);
  const DirectoriesToClean = await transferDirectories(DirtyDirectories, DirtyDirectory);
  const GroupedFiles = await groupFiles(DirectoriesToClean);

  console.log("Directories to clean:", DirectoriesToClean.length);
  console.log("Grouped Files:", GroupedFiles.length);
  console.log(" ");

  GroupedFiles.forEach(async (Group, index) => {
    // Get Group's company for folder organisation
    const FileName = await getFileName(Group.PDF);
    const Company = await getTestCompany(Group);
    if (!Company) throw `Company ${index} is mixed`;

    // Create containing directory
    const sectionPath = await createDirectory(`${NewCleanDirectory}/${Company}/${Group.Section}`);
    const datePath = await createDirectory(`${sectionPath}/${FileName}`);
    const Directory = await createDirectory(`${datePath}/${formattedDate}`);
    console.log("Created containing directory");
    console.log(" ");

    //Copy over misc files
    await PDFCopier(Group.PDF, Directory);
    await HTMLCopier(Group.HTML, Directory);
    await CSVCopier(Group.CSV, Directory);

    // Create excel stuff
    const ExcelData = await createExcel(Directory, FileName);

    //  Transfer Data to new escel files
    const Result = await DataTransfer(
      Group.CSV,
      Group.Section,
      ExcelData.Workbook,
      ExcelData.WorkSheet,
      ExcelData.ExcelPath
    );

    Result ? TestResults.Passed++ : TestResults.Failed++;
    console.log(" ");
    console.log(" ");
  });

  console.log("Results:", TestResults);
};

module.exports = { WorkConverter };
