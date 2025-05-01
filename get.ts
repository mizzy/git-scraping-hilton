import { firefox } from "playwright";
import { locationCodeMap, HotelLocation } from "./config_type";
import type { Config } from "./config_type";
import { formatDate } from "./utils";

type Result = {
  location: HotelLocation;
  arrivalDate: string;
  departureDate: string;
  // honorsDiscount: string | null;
  hpcjDiscount: string | null;
  points: string | null;
};

const get = async (config: Config): Promise<Result> => {
  const url = new URL("https://www.hilton.com/en/book/reservation/rooms");
  url.searchParams.set("ctyhocn", locationCodeMap[config.location]);
  url.searchParams.set("arrivalDate", formatDate(config.arrivalDate));
  url.searchParams.set("departureDate", formatDate(config.departureDate));
  url.searchParams.set("redeemPts", "true");
  url.searchParams.set("room1NumAdults", "1");

  const browser = await firefox.launch({
    headless: true,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  let honorsDiscount: string | null = null;
  let hpcjDiscount: string | null = null;
  let points: string | null = null;

  try {
    await page.goto(url.href);

    await page.waitForSelector('[data-testid="moreRatesButton"]', {
      state: "visible",
      timeout: 60000,
    });

    await page.locator('[data-testid="moreRatesButton"] >> nth=0').click();

    await page.waitForSelector('[data-testid="pamRatesBlock"]', {
      state: "visible",
      timeout: 60000,
    });

    // Flexible Rate Honors Discount
    const honorsDiscountElement = await page.$(
      '[data-testid="honorsDiscountBookCTA"]',
    );
    honorsDiscount = (await honorsDiscountElement?.textContent())?.trim()!;
    honorsDiscount = honorsDiscount.match(/(¥[\d,]+)/)?.[1]!;

    // HPCJ Discount (Flexible Rate * 0.75)
    const standardPriceElement = await page.$(
      '[data-testid="standardPriceBookCTA"]',
    );
    let standardPrice = (await standardPriceElement?.textContent())?.trim()!;
    standardPrice = standardPrice.match(/(¥[\d,]+)/)?.[1]!;

    const numericString = standardPrice.replace(/[¥,]/g, "");
    const numberValue = parseFloat(numericString.trim()!);
    const multipliedValue = Math.round(numberValue * 0.75);
    hpcjDiscount = "¥" + multipliedValue.toLocaleString("ja-JP");

    // Points
    const pointsElement = await page.$(
      '[data-testid="pamRatesBlock"] .sr-only',
    );
    points = (await pointsElement?.textContent())?.trim()!;
    points = points.match(/([\d,]+)/)?.[1]!;
  } catch (error) {
    console.error("Error fetching data:", error);

    // await page.screenshot({ path: "error_screenshot.png" });

    throw error;
  } finally {
    await page.close();
    await browser.close();
  }

  return {
    location: config.location,
    arrivalDate: formatDate(config.arrivalDate),
    departureDate: formatDate(config.departureDate),
    // honorsDiscount: honorsDiscount,
    hpcjDiscount: hpcjDiscount,
    points,
  };
};

export { get };
export type { Result };
