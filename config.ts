import { HotelLocation } from "./code";

type Config = {
  location: HotelLocation;
  arrivalDate: Date;
  departureDate: Date;
};

const config: Config = {
  location: HotelLocation.Odaiba,
  arrivalDate: new Date("2025-03-09"),
  departureDate: new Date("2025-03-10"),
};

export { config };
