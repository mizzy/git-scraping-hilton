enum HotelLocation {
  Fukuoka = "Fukuoka",
  Odaiba = "Odaiba",
}

type LocationCode = {
  [key in HotelLocation]: string;
};

const locationCodeMap: LocationCode = {
  [HotelLocation.Fukuoka]: "FUKHIHI",
  [HotelLocation.Odaiba]: "TYOTOHI",
};

export { HotelLocation, locationCodeMap };
