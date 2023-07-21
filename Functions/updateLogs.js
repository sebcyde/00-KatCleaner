const fs = require("fs");

const updateLogs = async (Res, LogPath, failedTests) => {
  console.log(`Conversions complete: ${Res.Total}/${Res.Total}`);
  console.log(`Skipped: ${Res.Skipped}`);
  console.log(`Passed: ${Res.Passed}`);
  console.log(`Failed: ${Res.Failed}`);
  console.log(" ");
  console.log("Failed Tests:", failedTests);
  console.log(" ");

  console.log("Updating Logs..");

  fs.promises.appendFile(LogPath, "\n");
  fs.promises.appendFile(LogPath, `Conversions complete: ${Res.Total}/${Res.Total}\n`);
  fs.promises.appendFile(LogPath, `Skipped: ${Res.Skipped}\n`);
  fs.promises.appendFile(LogPath, `Passed: ${Res.Passed}\n`);
  fs.promises.appendFile(LogPath, `Failed: ${Res.Failed}\n\n`);

  fs.promises.appendFile(LogPath, "Failed Tests:\n");

  failedTests.forEach((log) => {
    fs.promises.appendFile(LogPath, `${log}\n`);
  });
  console.log("Logs Updated.");
  console.log("");
};

module.exports = { updateLogs };
