const fs = require("fs").promises;
const { parse } = require("csv-parse");

const FileDataReader = async (filePath) => {
  try {
    console.log(" ");

    const Data = [];
    const input = await fs.readFile(filePath);
    await new Promise((resolve, reject) => {
      parse(
        input,
        {
          comment: "#",
        },
        function (err, records) {
          if (err) {
            reject(err);
          } else {
            records.forEach((record) => {
              Data.push(record);
            });
            resolve();
          }
        }
      );
    });
    return Data;
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
};

module.exports = { FileDataReader };
