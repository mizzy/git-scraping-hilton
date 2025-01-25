import { firefox } from "playwright";
import * as fs from "fs";

const locationMap: Record<string, string> = {
  Fukuoka: "FUKHIHI",
  Odaiba: "TYOTOHI",
};

const location: string = "Odaiba";
const arrivalDate: string = "2025-02-17";
const departureDate: string = "2025-02-18";

const url = new URL("https://www.hilton.com/en/book/reservation/rooms");
url.searchParams.set("ctyhocn", locationMap[location]);
url.searchParams.set("arrivalDate", arrivalDate);
url.searchParams.set("departureDate", departureDate);
url.searchParams.set("redeemPts", "true");
url.searchParams.set("room1NumAdults", "1");

const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec * 1000));

(async () => {
  const browser = await firefox.launch({
    headless: true,
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url.href);

  await page.waitForSelector('[data-testid="quickBookPrice"]', {
    state: "visible",
    timeout: 10000,
  });

  const priceElement = await page.$('[data-testid="quickBookPrice"]');
  const price = await priceElement?.textContent();

  const pointsElement = await page.$('[data-testid="pamMessaging"]');
  const pointsString = await pointsElement?.textContent();

  const match = pointsString?.match(/(\d{1,3}(?:,\d{3})*)/);

  let points = "";
  if (match) {
    points = match[1];
  }

  const jsonOutput = JSON.stringify(
    {
      location,
      arrivalDate,
      departureDate,
      price,
      points,
    },
    null,
    2,
  );

  fs.writeFileSync("result.json", jsonOutput, "utf-8");

  await page.close();
  await browser.close();
})();
