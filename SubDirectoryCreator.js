const fs = require("fs").promises;

const SubDirectoryCreator = async (NewCleanDirectory) => {
  console.log("SubDirCreator:", NewCleanDirectory);

  const electricDirectory = `${NewCleanDirectory}/Electric`;
  const redEngineDirectory = `${NewCleanDirectory}/RedEngine`;
  const flightClubDirectory = `${NewCleanDirectory}/FlightClub`;

  try {
    await fs.access(electricDirectory);
    console.log("Electric directory already exists at: ", NewCleanDirectory);
  } catch (error) {
    await fs.mkdir(electricDirectory);
    console.log("Electric directory created at: ", NewCleanDirectory);
  }

  try {
    await fs.access(redEngineDirectory);
    console.log("RedEngine directory already exists at: ", NewCleanDirectory);
  } catch (error) {
    await fs.mkdir(redEngineDirectory);
    console.log("RedEngine directory created at: ", NewCleanDirectory);
  }

  try {
    await fs.access(flightClubDirectory);
    console.log("FlightClub directory already exists at: ", NewCleanDirectory);
  } catch (error) {
    await fs.mkdir(flightClubDirectory);
    console.log("FlightClub directory created at: ", NewCleanDirectory);
  }
  console.log(" ");
};

module.exports = { SubDirectoryCreator };
