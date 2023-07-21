const fs = require("fs");

const checkDirectory = async (NewCleanDirectory) => {
  try {
    await fs.promises.access(NewCleanDirectory);
    console.log("Clean directory already exists.");
  } catch (error) {
    await fs.promises.mkdir(NewCleanDirectory);
    console.log("Created clean container");
  }
};

module.exports = { checkDirectory };
