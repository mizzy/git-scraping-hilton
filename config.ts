import { HotelLocation } from "./config_type";
import type { Configs } from "./config_type";

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
