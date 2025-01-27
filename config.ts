import { HotelLocation } from "./code";

type Config = {
  location: HotelLocation;
  arrivalDate: Date;
  departureDate: Date;
};

type Configs = Config[];

const configs: Configs = [
  {
    location: HotelLocation.Odaiba,
    arrivalDate: new Date("2025-03-09"),
    departureDate: new Date("2025-03-10"),
  },
  {
    location: HotelLocation.Ariake,
    arrivalDate: new Date("2025-03-09"),
    departureDate: new Date("2025-03-10"),
  },
];

export { configs };
export type { Config };
