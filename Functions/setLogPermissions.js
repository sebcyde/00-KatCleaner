const fs = require("fs");

const setFilePermissions = async (filePath) => {
  fs.open(filePath, "r", (err, fd) => {
    if (err) {
      console.error("Error opening the file:", err);
    } else {
      fs.fchmod(fd, 0o444, (err) => {
        if (err) {
          console.error("Error setting file permissions:", err);
        } else {
          fs.close(fd, (err) => {
            if (err) {
              console.error("Error closing the file:", err);
            } else {
              console.log("File is now read-only.");
            }
          });
        }
      });
    }
  });
};

module.exports = { setFilePermissions };
