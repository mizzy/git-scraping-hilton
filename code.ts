const HotelLocation = {
  Fukuoka: "Fukuoka",
  Odaiba: "Odaiba",
  Ariake: "Ariake",
} as const;

type HotelLocation = (typeof HotelLocation)[keyof typeof HotelLocation];

type LocationCode = {
  [key in HotelLocation]: string;
};

const locationCodeMap: LocationCode = {
  [HotelLocation.Fukuoka]: "FUKHIHI",
  [HotelLocation.Odaiba]: "TYOTOHI",
  [HotelLocation.Ariake]: "TYOARDI",
};

export { HotelLocation, locationCodeMap };
