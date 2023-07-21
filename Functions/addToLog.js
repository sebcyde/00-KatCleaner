const fs = require("fs");

const addToLog = async (LogPath, Group, TestResult) => {
  console.log("LOG PATH: ", LogPath);
  console.log("GROUP: ", Group);
  console.log("Test Result:", TestResult);

  await fs.promises.appendFile(LogPath, `PDF Path: ${Group.PDF}\n`);
  await fs.promises.appendFile(LogPath, `HTML Path: ${Group.HTML}\n`);
  await fs.promises.appendFile(LogPath, `CSV Path: ${Group.CSV}\n`);
  await fs.promises.appendFile(LogPath, `Test Section: ${Group.Section}\n`);
  await fs.promises.appendFile(LogPath, `Test Result: ${TestResult ? "PASS" : "FAIL"}\n\n\n`);

  console.log(" ");
};

module.exports = { addToLog };
