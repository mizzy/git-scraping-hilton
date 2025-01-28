import { firefox } from "playwright";
import { Config } from "./config";
import { locationCodeMap, HotelLocation } from "./code";

type Result = {
  location: HotelLocation;
  arrivalDate: string;
  departureDate: string;
  price: string | null;
  points: string | null;
};

const get = async (config: Config): Promise<Result> => {
  const url = new URL("https://www.hilton.com/en/book/reservation/rooms");
  url.searchParams.set("ctyhocn", locationCodeMap[config.location]);
  url.searchParams.set(
    "arrivalDate",
    config.arrivalDate.toISOString().split("T")[0],
  );
  url.searchParams.set(
    "departureDate",
    config.departureDate.toISOString().split("T")[0],
  );
  url.searchParams.set("redeemPts", "true");
  url.searchParams.set("room1NumAdults", "1");

  const browser = await firefox.launch({
    headless: true,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  let price: string | null = null;
  let points: string | null = null;

  try {
    await page.goto(url.href);

    await page.waitForSelector('[data-testid="quickBookPrice"]', {
      state: "visible",
      timeout: 20000,
    });

    await page.waitForSelector('[data-testid="pamMessaging"]', {
      state: "visible",
      timeout: 20000,
    });

    const priceElement = await page.$('[data-testid="quickBookPrice"]');
    price = (await priceElement?.textContent())?.trim() || null;

    const pointsElement = await page.$('[data-testid="pamMessaging"]');
    const pointsString = (await pointsElement?.textContent())?.trim();

    const match = pointsString?.match(/(\d{1,3}(?:,\d{3})*)/);

    if (match) {
      points = match[1];
    }
  } catch (error) {
    console.error("Error fetching data:", error);

    await page.screenshot({ path: "error_screenshot.png" });

    throw error;
  } finally {
    await page.close();
    await browser.close();
  }

  return {
    location: config.location,
    arrivalDate: config.arrivalDate.toISOString().split("T")[0],
    departureDate: config.departureDate.toISOString().split("T")[0],
    price,
    points,
  };
};

export { get };
export type { Result };
