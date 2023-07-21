const { FileFisher } = require("./FileFisher");

const transferDirectories = async (DirtyDirectories, DirtyDirectory) => {
  const TransferredDirectories = [];
  let completedDirectories = 0;

  for (const Dir of DirtyDirectories) {
    console.log("Currently transferring:", Dir);
    try {
      // Get files from all directories in each top level directory
      const AllFileDetails = await FileFisher(`${DirtyDirectory}/${Dir}`);
      console.log("All File Details:", AllFileDetails.length);

      AllFileDetails.forEach((FileDetails) => {
        // console.log("FD:", FileDetails);
        TransferredDirectories.push(FileDetails);
      });
      completedDirectories++;
    } catch (error) {
      console.error("Error transferring directory from top level directory:", error);
    }
  }

  return TransferredDirectories;
};

module.exports = { transferDirectories };
