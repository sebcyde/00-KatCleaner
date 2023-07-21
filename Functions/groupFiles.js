const path = require("path");

const groupFiles = async (Files) => {
  const BaseNames = new Set();
  const GroupedFiles = [];
  // console.log("Group Files: ", Files);

  Files.forEach((File) => {
    if (File.includes("csv")) BaseNames.add(path.basename(File, path.extname(File)));
  });

  BaseNames.forEach((BaseName) => {
    const groupedfiles = Files.filter(
      (File) => path.basename(File, path.extname(File)) === BaseName
    );

    GroupedFiles.push({
      PDF: groupedfiles.filter((File) => File.includes("pdf"))[0],
      HTML: groupedfiles.filter((File) => File.includes("html"))[0],
      CSV: groupedfiles.filter((File) => File.includes("csv"))[0],
      Section: groupedfiles.filter((File) => File.includes("pdf"))[0].split("\\")[11],
    });
  });

  return GroupedFiles;
};

module.exports = { groupFiles };
