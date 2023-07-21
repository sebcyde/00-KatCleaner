const fs = require("fs").promises;
const path = require("path");

// ORIGINAL
// const FileFisher = async (directoryPath) => {
//   try {
//     const TLDStats = await fs.stat(directoryPath);

//     if (TLDStats.isDirectory()) {
//       const topFiles = await fs.readdir(directoryPath);
//       const Collection = [];

//       for (const topFile of topFiles) {
//         const topFilePath = path.join(directoryPath, topFile);
//         const topFileStats = await fs.stat(topFilePath);

//         if (topFileStats.isDirectory()) {
//           // Recursively call FileFisher for nested directories
//           const subCollection = await FileFisher(topFilePath);
//           Collection.push(...subCollection);
//         } else {
//           // Get all the files in the directory and check if they match the desired extensions
//           const FolderContents = {
//             Company: "Other",
//             Path: topFilePath,
//             Name: path.basename(topFilePath, path.extname(topFilePath)),
//             HTML: "",
//             PDF: "",
//             CSV: "",
//           };

//           if (path.extname(topFilePath) === ".html") {
//             FolderContents.HTML = topFilePath;
//           } else if (path.extname(topFilePath) === ".pdf") {
//             FolderContents.PDF = topFilePath;
//           } else if (path.extname(topFilePath) === ".csv") {
//             FolderContents.CSV = topFilePath;
//           }

//           // Extract the company name from the path
//           if (topFilePath.includes("Electric")) {
//             FolderContents.Company = "Electric";
//           } else if (topFilePath.includes("Red")) {
//             FolderContents.Company = "RedEngine";
//           } else if (topFilePath.includes("Flight")) {
//             FolderContents.Company = "FlightClub";
//           }

//           Collection.push(FolderContents);
//         }
//       }

//       return Collection;
//     } else {
//       return [];
//     }
//   } catch (error) {
//     console.error("Error in FileFisher:", error);
//     return null;
//   }
// };

// NEW VERSION
// const FileFisher = async (directoryPath) => {
//   try {
//     const TopLevelDirectoryStats = await fs.stat(directoryPath);
//     const TopLevelFiles = await fs.readdir(directoryPath);
//     console.log("Top Level Files:", TopLevelFiles);

//     let Collection = []; // Initialize a new array here

//     if (TopLevelDirectoryStats.isDirectory()) {
//       console.log("DIRECTORY");

//       const directoryObject = {
//         Company: GetCompanyName(directoryPath), // Replace getCompanyFromPath with the function to extract the company name
//         Path: directoryPath,
//         Name: path.basename(directoryPath),
//         HTML: "",
//         PDF: "",
//         CSV: "",
//       };

//       for (const TopLevelFile of TopLevelFiles) {
//         console.log("Top Level File:", TopLevelFile);
//         const SecondaryLevelPath = path.join(directoryPath, TopLevelFile);
//         const SecondaryLevelDirectoryStats = await fs.stat(SecondaryLevelPath);

//         if (SecondaryLevelDirectoryStats.isDirectory()) {
//           const SubCollection = await FileFisher(SecondaryLevelPath); // Remove Collection parameter from the recursive call
//           if (SubCollection) Collection.push(...SubCollection);
//           console.log("Subcollection:", SubCollection);
//         } else {
//           if (path.extname(SecondaryLevelPath) === ".html") {
//             directoryObject.HTML = SecondaryLevelPath;
//           } else if (path.extname(SecondaryLevelPath) === ".pdf") {
//             directoryObject.PDF = SecondaryLevelPath;
//           } else if (path.extname(SecondaryLevelPath) === ".csv") {
//             directoryObject.CSV = SecondaryLevelPath;
//           }
//         }
//       }

//       Collection.push(directoryObject);
//     }

//     console.log("Final Collection:", Collection);
//     return Collection;
//   } catch (error) {
//     console.log("Error in FileFisher: ", error);
//     return null;
//   }
// };

// NEWER VERSION
const FileFisher = async (Directory) => {
  const Files = [];
  const Stuff = await fs.readdir(Directory);

  await Promise.all(
    Stuff.map(async (File) => {
      const Absolute = path.join(Directory, File);
      const AbsStat = await fs.stat(Absolute);
      if (AbsStat.isDirectory()) {
        const subFiles = await FileFisher(Absolute);
        Files.push(...subFiles);
      } else {
        Files.push(Absolute);
      }
    })
  );

  return Files;
};

module.exports = { FileFisher };
