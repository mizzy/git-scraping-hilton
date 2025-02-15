import {HotelLocation} from "./config_type";
import type {Configs} from "./config_type";

const configs: Configs = [
    {
        location: HotelLocation.Ariake,
        arrivalDate: new Date("2025-11-12"),
        departureDate: new Date("2025-11-14"),
    },
    {
        location: HotelLocation.Fukuoka,
        arrivalDate: new Date("2025-11-13"),
        departureDate: new Date("2025-11-14"),
    },
    {
        location: HotelLocation.Ariake,
        arrivalDate: new Date("2025-11-16"),
        departureDate: new Date("2025-11-17"),
    },
    {
        location: HotelLocation.Ariake,
        arrivalDate: new Date("2025-11-16"),
        departureDate: new Date("2025-11-18"),
    },
];

export {configs};
