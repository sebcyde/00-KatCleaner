const getTestCompany = async (Group) => {
  if (Group.PDF.includes("Electric")) {
    return "ElectricShuffle";
  } else if (Group.PDF.includes("Red")) {
    return "RedEngine";
  } else if (Group.PDF.includes("Flight")) {
    return "FlightClub";
  } else {
    return false;
  }
};

module.exports = { getTestCompany };
