export const updateLogs = async (Res) => {
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
