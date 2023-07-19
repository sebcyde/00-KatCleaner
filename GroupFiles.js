const path = require("path");

const GroupFiles = async (Files) => {
  const BaseNames = new Set();
  const GroupedFiles = [];

  Files.forEach((File) => {
    if (File.includes("csv")) BaseNames.add(path.basename(File, path.extname(File)));
  });

  BaseNames.forEach((BaseName) => {
    const Group = Files.filter((File) => path.basename(File, path.extname(File)) === BaseName);
    GroupedFiles.push(Group);
  });

  return GroupedFiles;
};

module.exports = { GroupFiles };
