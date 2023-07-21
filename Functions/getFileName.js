const getFileName = async (Path) => {
  return Path.split("\\")[13];
};

module.exports = { getFileName };
