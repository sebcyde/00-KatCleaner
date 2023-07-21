const filterDirtyDirectories = async (files) => {
  console.log("FilterDirtDirectories - Files:", files);

  return files
    .filter((file) => file.isDirectory())
    .map((file) => file.name)
    .filter((name) => name.toLowerCase() != "self-healing");
};

module.exports = { filterDirtyDirectories };
