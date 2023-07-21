const fs = require("fs");

const createLogFile = async (LogDirectory, formattedDate) => {
  let LogPath = `${LogDirectory}/${formattedDate}.txt`;

  console.log("LogDirectory:", LogDirectory);
  console.log("LogPath:", LogPath);

  try {
    await fs.promises.access(LogDirectory);
    console.log("Log directory already exists.");
  } catch (error) {
    try {
      await fs.promises.mkdir(LogDirectory, { recursive: true });
      console.log("Log directory created successfully.");
    } catch (error) {
      console.error("Error creating log directory:", error);
      return; // Abort further processing if directory creation fails
    }
  }

  try {
    await fs.promises.access(LogPath);
    console.log("Log file already exists.");
  } catch (error) {
    try {
      await fs.promises.writeFile(LogPath, "");
      console.log("Log file created successfully.");
    } catch (error) {
      console.error("Error creating log file:", error);
    }
  }

  fs.promises.appendFile(LogPath, `Date of execution: ${formattedDate}\n\n`);

  return LogPath;
};

module.exports = { createLogFile };
