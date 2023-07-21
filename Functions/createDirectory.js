const fs = require("fs").promises;

const createDirectory = async (Path) => {
  try {
    await fs.access(Path);
    console.log("Directory already exists at: ", Path);
  } catch (error) {
    try {
      await fs.mkdir(Path);
      console.log("Directory created at: ", Path);
    } catch (error) {
      console.log("Failed to create directory at:", Path);
    }
  }
  return Path;
};

module.exports = { createDirectory };
