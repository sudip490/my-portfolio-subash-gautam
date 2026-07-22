import { NextResponse } from "next/server";

/* Live numbers for the product screens: the real NEPSE index and real
   gold/silver rates. Cached for 5 minutes (the same freshness contract
   the Gold & Silver app itself honours) and every upstream is optional —
   a failure returns null for that field and the screens fall back to
   their mock values. Sources:

   - NEPSE index:  nepalipaisa.com public index feed
   - Gold/silver:  gold-api.com spot (USD per troy ounce, no key)
   - USD → NPR:    Nepal Rastra Bank's official forex API

   Metal prices are international spot converted at the NRB rate — the
   screens label them "live spot × NRB", not as FENEGOSIDA's Nepali
   market rate, which carries a local premium. */

export const revalidate = 300;

/* grams per tola / grams per troy ounce */
const TOLA_PER_OZT = 11.6638038 / 31.1034768;

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0 (portfolio)" },
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json();
}

async function fetchNepse() {
  const data = (await getJson("https://nepalipaisa.com/api/GetIndexLive")) as {
    result?: { indexName: string; indexValue: number; difference: number; percentChange: number }[];
  };
  const row = data.result?.find((r) => r.indexName?.toLowerCase() === "nepse");
  if (!row) return null;
  return { value: row.indexValue, change: row.difference, pct: row.percentChange };
}

async function fetchUsdNpr() {
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const to = new Date();
  const from = new Date(to.getTime() - 6 * 86_400_000);
  const data = (await getJson(
    `https://www.nrb.org.np/api/forex/v1/rates?page=1&per_page=100&from=${fmt(from)}&to=${fmt(to)}`
  )) as {
    data?: { payload?: { rates?: { currency: { iso3: string }; sell: string }[] }[] };
  };
  let sell: number | null = null;
  /* Payload is one entry per day; walk all of them so we end on the latest. */
  for (const day of data.data?.payload ?? []) {
    const usd = day.rates?.find((r) => r.currency?.iso3 === "USD");
    if (usd?.sell) sell = parseFloat(usd.sell);
  }
  return sell;
}

async function fetchMetalUsd(symbol: "XAU" | "XAG") {
  const data = (await getJson(`https://api.gold-api.com/price/${symbol}`)) as { price?: number };
  return typeof data.price === "number" ? data.price : null;
}

export async function GET() {
  /* gold-api rate-limits rapid calls, so the two metals go sequentially;
     everything else runs alongside. */
  const [nepse, usdNpr, gold] = await Promise.allSettled([
    fetchNepse(),
    fetchUsdNpr(),
    fetchMetalUsd("XAU"),
  ]);
  const silver = await Promise.allSettled([fetchMetalUsd("XAG")]).then(([s]) => s);

  const ok = <T,>(r: PromiseSettledResult<T>): T | null =>
    r.status === "fulfilled" ? r.value : null;

  const rate = ok(usdNpr);
  const goldOzt = ok(gold);
  const silverOzt = ok(silver);

  return NextResponse.json({
    nepse: ok(nepse),
    usdNpr: rate,
    /* NPR per tola; null when either leg of the conversion is missing. */
    gold: rate && goldOzt ? Math.round(goldOzt * TOLA_PER_OZT * rate) : null,
    silver: rate && silverOzt ? Math.round(silverOzt * TOLA_PER_OZT * rate) : null,
    asOf: new Date().toISOString(),
  });
}
