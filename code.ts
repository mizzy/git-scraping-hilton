enum HotelLocation {
  Fukuoka = "Fukuoka",
  Odaiba = "Odaiba",
  Ariake = "Ariake",
}

type LocationCode = {
  [key in HotelLocation]: string;
};

const locationCodeMap: LocationCode = {
  [HotelLocation.Fukuoka]: "FUKHIHI",
  [HotelLocation.Odaiba]: "TYOTOHI",
  [HotelLocation.Ariake]: "TYOARDI",
};

export { HotelLocation, locationCodeMap };
