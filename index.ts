import * as fs from "fs";
import { configs } from "./config";
import { get } from "./get";
import type { Result } from "./get";
import { formatDate } from "./utils";

const loadResults = (filePath: string): Result[] => {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const rawData: any[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    return rawData.map((item) => ({
      location: item.location,
      arrivalDate: item.arrivalDate,
      departureDate: item.departureDate,
      honorsDiscount: item.honorsDiscount ?? null,
      hpcjDiscount: item.hpcjDiscount ?? null,
      points: item.points ?? null,
    }));
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return [];
  }
};

const main = async () => {
  let prevResults: Result[] = loadResults("result.json");

  const filteredResults: Result[] = prevResults.filter((result) =>
    configs.some(
      (config) =>
        result.location === config.location &&
        result.arrivalDate === formatDate(config.arrivalDate) &&
        result.departureDate === formatDate(config.departureDate),
    ),
  );

  const configsToAdd: Result[] = configs
    .filter(
      (config) =>
        !prevResults.some(
          (result) =>
            result.location === config.location &&
            result.arrivalDate === formatDate(config.arrivalDate) &&
            result.departureDate === formatDate(config.departureDate),
        ),
    )
    .map((config) => ({
      location: config.location,
      arrivalDate: formatDate(config.arrivalDate),
      departureDate: formatDate(config.departureDate),
      honorsDiscount: null,
      hpcjDiscount: null,
      points: null,
    }));

  const results: Result[] = [...filteredResults, ...configsToAdd];

  const processConfigs = async () => {
    const promises = configs.map(async (config) => {
      try {
        const result = await get(config);
        console.log(`Processed config for location: ${config.location}`);
        return result;
      } catch (error) {
        console.error(
          `Error processing config for location ${config.location}:`,
          error,
        );
        return null;
      }
    });

    const resultsWithNulls = await Promise.all(promises);
    for (const result of results) {
      for (const resultWithNull of resultsWithNulls) {
        if (
          result.location == resultWithNull?.location &&
          result.arrivalDate == resultWithNull.arrivalDate &&
          result.departureDate == resultWithNull.departureDate
        ) {
          result.honorsDiscount = resultWithNull.honorsDiscount;
          result.hpcjDiscount = resultWithNull.hpcjDiscount;
          result.points = resultWithNull.points;
        }
      }
    }
  };

  await processConfigs();

  const jsonOutput = JSON.stringify(results, null, 2);
  fs.writeFileSync("result.json", jsonOutput, "utf-8");
  console.log("result.json has been written successfully.");
};

main().catch((err) => {
  console.error("Unexpected error:", err);
});
