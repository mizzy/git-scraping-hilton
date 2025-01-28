import * as fs from "fs";
import { configs } from "./config";
import { get } from "./get";
import type { Result } from "./get";

const main = async () => {
  let results: Result[] = fs.existsSync("result.json")
    ? JSON.parse(fs.readFileSync("result.json", "utf-8"))
    : [];

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
          result.price = resultWithNull.price;
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
