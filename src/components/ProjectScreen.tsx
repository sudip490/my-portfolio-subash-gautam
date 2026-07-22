/* Product screens for the project cards and case studies.

   Most of this work ships inside other companies' banking apps — there is
   no public page to screenshot — so each project gets a hand-built replica
   of its actual UI, framed in the device it really runs on: a phone for
   the app modules, a browser for the web platforms. Gold & Silver is live
   and public, so it uses a real capture (public/work/gold-silver.jpg).

   Everything is static markup — no state, no timers, no randomness — so
   the screens cost nothing to render and can never mismatch on hydration.
   They're decorative (the card copy already names the product), hence
   aria-hidden at the root.

   The screens DO move, but via CSS keyframes only (globals.css,
   "Product-screen motion") — bars fill, the floorsheet scrolls, tasks
   tick themselves — so the static-markup guarantees above still hold,
   and prefers-reduced-motion switches all of it off at once. */

import Image from "next/image";
import type { ReactNode } from "react";
import goldSilverShot from "../../public/work/gold-silver.jpg";

/* ---------------------------------------------------------------- */
/* Device frames                                                     */
/* ---------------------------------------------------------------- */

function BrowserFrame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-md border border-ink-line bg-ink shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)]">
      <div className="flex items-center gap-3 border-b border-ink-line bg-ink-soft px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ink-line" />
          <span className="h-2 w-2 rounded-full bg-ink-line" />
          <span className="h-2 w-2 rounded-full bg-accent" />
        </div>
        <span className="flex-1 truncate rounded-sm bg-ink px-3 py-1 font-mono text-[10px] text-paper-dim">
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-[1.6rem] border border-ink-line bg-ink shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)]">
      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <span className="font-mono text-[9px] text-paper-dim">09:41</span>
        <span className="h-3 w-16 rounded-full bg-ink-soft" />
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-paper-dim" />
          <span className="h-1.5 w-3 rounded-sm bg-paper-dim" />
        </span>
      </div>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Small shared pieces                                               */
/* ---------------------------------------------------------------- */

const up = "text-emerald-400";
const down = "text-red-400";

function Chip({ children, tone = "dim" }: { children: ReactNode; tone?: "dim" | "accent" | "green" | "amber" }) {
  const tones = {
    dim: "border-ink-line text-paper-dim",
    accent: "border-accent/50 text-accent-bright",
    green: "border-emerald-500/40 text-emerald-400",
    amber: "border-amber-500/40 text-amber-400",
  } as const;
  return (
    <span className={`inline-block border px-1.5 py-0.5 font-mono text-[8px] tracking-wider uppercase ${tones[tone]}`}>
      {children}
    </span>
  );
}

/* Tiny area chart used by the portfolio screens. */
function Spark({ points, height = 44 }: { points: string; height?: number }) {
  return (
    <svg viewBox={`0 0 200 ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <polyline
        points={points}
        pathLength={1}
        className="animate-screen-draw"
        fill="none"
        stroke="var(--color-accent-bright)"
        strokeWidth="1.5"
        strokeOpacity="0.9"
      />
      <polygon
        points={`${points} 200,${height} 0,${height}`}
        className="animate-screen-fade"
        fill="var(--color-accent)"
        fillOpacity="0.12"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* Screens                                                           */
/* ---------------------------------------------------------------- */

/* Capital Market — the stock module inside IME Pay / Khalti / GIBL. */
function CapitalMarketScreen() {
  const holdings = [
    { s: "NABIL", q: "512 kitta", ltp: "498.50", chg: "+1.24%", good: true },
    { s: "GBIME", q: "1,040 kitta", ltp: "312.00", chg: "+2.08%", good: true },
    { s: "NICA", q: "260 kitta", ltp: "871.20", chg: "-0.83%", good: false },
    { s: "HIDCL", q: "800 kitta", ltp: "214.90", chg: "+0.42%", good: true },
  ];
  return (
    <PhoneFrame>
      <div className="px-5 pt-3 pb-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[13px] font-bold text-paper">Portfolio</span>
          <Chip tone="accent">NEPSE 2,146.32 ▲</Chip>
        </div>
        <p className="font-mono text-[9px] tracking-wider text-paper-dim uppercase">Total value</p>
        <p className="mt-1 text-[22px] font-bold text-paper">NPR 12,45,680</p>
        <p className={`animate-screen-blink mt-0.5 font-mono text-[10px] ${up}`}>
          +18,240 today · +1.49%
        </p>
        <div className="mt-3 mb-4">
          <Spark points="0,38 25,33 50,35 75,28 100,30 125,22 150,24 175,14 200,10" />
        </div>
        {holdings.map((h) => (
          <div key={h.s} className="flex items-center justify-between border-t border-ink-line py-2.5">
            <div>
              <p className="font-mono text-[11px] font-bold text-paper">{h.s}</p>
              <p className="font-mono text-[9px] text-paper-dim">{h.q}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[11px] text-paper">{h.ltp}</p>
              <p className={`font-mono text-[9px] ${h.good ? up : down}`}>{h.chg}</p>
            </div>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

/* Brish Terminal — live floorsheet + whale radar. */
function BrishScreen() {
  const rows = [
    { sym: "NABIL", b: "58", s: "44", qty: "25,000", rate: "501.00", whale: true },
    { sym: "NIFRA", b: "36", s: "42", qty: "3,200", rate: "312.10", whale: false },
    { sym: "SCB", b: "44", s: "58", qty: "1,150", rate: "428.00", whale: false },
    { sym: "GBIME", b: "42", s: "36", qty: "8,600", rate: "311.80", whale: false },
    { sym: "UPPER", b: "51", s: "49", qty: "12,400", rate: "188.20", whale: true },
    { sym: "NICA", b: "49", s: "51", qty: "940", rate: "870.00", whale: false },
  ];
  return (
    <BrowserFrame url="brish.swifttech.com.np/floorsheet">
      <div className="px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-wider text-paper uppercase">
            <span className="animate-screen-pulse h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Floorsheet — Live
          </span>
          <Chip tone="accent">Whale radar on</Chip>
        </div>
        <div className="grid grid-cols-[1.2fr_0.7fr_0.7fr_1fr_1fr_auto] gap-x-3 border-b border-ink-line pb-1.5 font-mono text-[8px] tracking-wider text-paper-dim uppercase">
          <span>Symbol</span>
          <span>Buyer</span>
          <span>Seller</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Rate</span>
          <span />
        </div>
        {/* The floorsheet actually flows: the row list rendered twice
            inside a clipped viewport, marquee'd by -50% for a seamless
            loop — the closest a mockup gets to "every trade, live". */}
        <div className="relative h-[170px] overflow-hidden">
          <div className="animate-screen-rows">
            {[...rows, ...rows].map((r, i) => (
              <div
                key={r.sym + i}
                className={`grid grid-cols-[1.2fr_0.7fr_0.7fr_1fr_1fr_auto] items-center gap-x-3 border-b border-ink-line/60 py-1.5 font-mono text-[10px] ${
                  r.whale ? "bg-accent/10" : ""
                }`}
              >
                <span className="font-bold text-paper">{r.sym}</span>
                <span className="text-paper-dim">{r.b}</span>
                <span className="text-paper-dim">{r.s}</span>
                <span className="text-right text-paper">{r.qty}</span>
                <span className="text-right text-paper">{r.rate}</span>
                <span>{r.whale ? <Chip tone="accent">Whale</Chip> : null}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-2 truncate font-mono text-[9px] text-paper-dim">
          <span className="text-accent-bright">BLOCK RADAR</span> · NIFRA 3.2L kitta @ 312 · UPPER
          1.2L @ 188 · portfolio vs NEPSE +4.2%
        </p>
      </div>
    </BrowserFrame>
  );
}

/* Global Smart Plus — retail omni-channel banking app. */
function SmartPlusScreen() {
  const txns = [
    { t: "Salary — Swift Technology", v: "+52,000.00", good: true },
    { t: "NEA Electricity Bill", v: "-1,240.00", good: false },
    { t: "Topup — NTC", v: "-500.00", good: false },
  ];
  return (
    <PhoneFrame>
      <div className="px-5 pt-3 pb-5">
        <p className="text-[13px] font-bold text-paper">Good morning, Subash</p>
        <div className="relative mt-3 overflow-hidden rounded-md border border-accent/40 bg-accent/15 p-4">
          <span className="animate-screen-sheen pointer-events-none absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-paper/10 to-transparent" />
          <p className="font-mono text-[9px] tracking-wider text-paper-dim uppercase">
            Savings · 001·····212
          </p>
          <p className="mt-1.5 text-[20px] font-bold text-paper">NPR 84,520.75</p>
          <p className="mt-0.5 font-mono text-[9px] text-paper-dim">Available balance</p>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {["Send", "Pay", "Scan", "More"].map((a) => (
            <div key={a} className="border border-ink-line py-2.5 text-center">
              <span className="mx-auto mb-1 block h-3 w-3 border border-accent-bright" />
              <span className="font-mono text-[8px] tracking-wider text-paper-dim uppercase">{a}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 mb-1 font-mono text-[9px] tracking-wider text-paper-dim uppercase">Recent</p>
        {txns.map((t) => (
          <div key={t.t} className="flex items-center justify-between border-t border-ink-line py-2.5">
            <span className="truncate pr-3 text-[11px] text-paper">{t.t}</span>
            <span className={`font-mono text-[10px] ${t.good ? up : "text-paper-dim"}`}>{t.v}</span>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

/* Global Biznex — corporate banking: bulk payments + maker/checker. */
function BiznexScreen() {
  const queue = [
    { ref: "BLK-4021", ben: "Payroll · 1,204 transfers", amt: "48,16,000", status: "Pending checker", tone: "amber" as const },
    { ref: "TRF-9310", ben: "Himal Suppliers Pvt. Ltd.", amt: "6,40,000", status: "Approved", tone: "accent" as const },
    { ref: "TRF-9308", ben: "Everest Logistics", amt: "2,12,500", status: "Released", tone: "green" as const },
  ];
  return (
    <BrowserFrame url="biznex.globalimebank.com/payments/approvals">
      <div className="px-4 py-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold tracking-wider text-paper uppercase">
            Approvals Queue
          </span>
          <Chip>Maker · Checker · Releaser</Chip>
        </div>
        <div className="mb-3 border border-ink-line bg-ink-soft p-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-mono text-[10px] text-paper">payroll_july.csv</span>
            <span className="font-mono text-[9px] text-paper-dim">936 / 1,204 validated</span>
          </div>
          <div className="h-1 w-full bg-ink-line">
            <div className="animate-screen-fill h-1 w-[78%] bg-accent-bright" />
          </div>
        </div>
        <div className="grid grid-cols-[0.8fr_1.6fr_1fr_auto] gap-x-3 border-b border-ink-line pb-1.5 font-mono text-[8px] tracking-wider text-paper-dim uppercase">
          <span>Ref</span>
          <span>Beneficiary</span>
          <span className="text-right">NPR</span>
          <span>Status</span>
        </div>
        {queue.map((q) => (
          <div
            key={q.ref}
            className="grid grid-cols-[0.8fr_1.6fr_1fr_auto] items-center gap-x-3 border-b border-ink-line/60 py-2 font-mono text-[10px]"
          >
            <span className="text-paper-dim">{q.ref}</span>
            <span className="truncate text-paper">{q.ben}</span>
            <span className="text-right text-paper">{q.amt}</span>
            {q.tone === "amber" ? (
              <span className="animate-screen-pulse inline-block">
                <Chip tone={q.tone}>{q.status}</Chip>
              </span>
            ) : (
              <Chip tone={q.tone}>{q.status}</Chip>
            )}
          </div>
        ))}
      </div>
    </BrowserFrame>
  );
}

/* Global Junior — child banking: goals, tasks, parental limits. */
function JuniorScreen() {
  const tasks = [
    { t: "Make your bed", r: "+50", done: true },
    { t: "Finish homework", r: "+100", done: true },
    { t: "Water the plants", r: "+50", done: false },
  ];
  return (
    <PhoneFrame>
      <div className="px-5 pt-3 pb-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[13px] font-bold text-paper">Aarav&apos;s Wallet</span>
          <Chip tone="accent">Junior</Chip>
        </div>
        <div className="border border-ink-line bg-ink-soft p-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[9px] tracking-wider text-paper-dim uppercase">
              Goal — New bicycle
            </p>
            <span className="font-mono text-[10px] text-accent-bright">64%</span>
          </div>
          <p className="mt-1.5 text-[16px] font-bold text-paper">
            NPR 6,400 <span className="text-[11px] font-normal text-paper-dim">/ 10,000</span>
          </p>
          <div className="mt-2 h-1 w-full bg-ink-line">
            <div className="animate-screen-fill h-1 w-[64%] bg-accent-bright" />
          </div>
        </div>
        <p className="mt-4 mb-1 font-mono text-[9px] tracking-wider text-paper-dim uppercase">
          Today&apos;s tasks
        </p>
        {tasks.map((t) => (
          <div key={t.t} className="flex items-center justify-between border-t border-ink-line py-2.5">
            <span className="flex items-center gap-2.5 text-[11px] text-paper">
              <span
                className={`inline-block h-3 w-3 border ${
                  t.done
                    ? "border-emerald-400 bg-emerald-400/70"
                    : "animate-junior-tick border-ink-line"
                }`}
              />
              {t.t}
            </span>
            <span className={`font-mono text-[10px] ${t.done ? up : "text-paper-dim"}`}>{t.r}</span>
          </div>
        ))}
        <p className="mt-3 border border-ink-line px-3 py-2 font-mono text-[9px] text-paper-dim">
          Daily spend limit NPR 500 — set by parent
        </p>
      </div>
    </PhoneFrame>
  );
}

/* Sani Securities — brokerage: order ticket + market depth. */
function SaniScreen() {
  const depth = [
    { bq: "1,200", bp: "498.00", ap: "498.50", aq: "860" },
    { bq: "2,450", bp: "497.90", ap: "499.00", aq: "1,340" },
    { bq: "980", bp: "497.50", ap: "499.40", aq: "2,100" },
    { bq: "3,600", bp: "497.00", ap: "500.00", aq: "5,000" },
  ];
  return (
    <BrowserFrame url="tms.sanisecurities.com.np/trade">
      <div className="grid grid-cols-[0.9fr_1.1fr] gap-4 px-4 py-3">
        <div>
          <div className="mb-2 grid grid-cols-2 gap-1">
            <span className="bg-accent py-1.5 text-center font-mono text-[10px] font-bold text-paper">
              BUY
            </span>
            <span className="border border-ink-line py-1.5 text-center font-mono text-[10px] text-paper-dim">
              SELL
            </span>
          </div>
          {[
            { k: "Symbol", v: "NABIL" },
            { k: "Quantity", v: "500" },
            { k: "Price", v: "498.50" },
          ].map((f) => (
            <div key={f.k} className="mb-1.5 flex items-center justify-between border border-ink-line px-2.5 py-1.5">
              <span className="font-mono text-[8px] tracking-wider text-paper-dim uppercase">{f.k}</span>
              <span className="font-mono text-[10px] text-paper">{f.v}</span>
            </div>
          ))}
          <span className="mt-1 block border border-accent-bright py-1.5 text-center font-mono text-[9px] tracking-wider text-accent-bright uppercase">
            Place order
          </span>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-paper uppercase">
              Depth — NABIL
            </span>
            <span className={`animate-screen-blink font-mono text-[9px] ${up}`}>LTP 498.50</span>
          </div>
          <div className="grid grid-cols-4 gap-x-2 border-b border-ink-line pb-1 font-mono text-[8px] tracking-wider text-paper-dim uppercase">
            <span className="text-right">Bid qty</span>
            <span className="text-right">Bid</span>
            <span className="text-right">Ask</span>
            <span className="text-right">Ask qty</span>
          </div>
          {depth.map((d) => (
            <div key={d.bp} className="grid grid-cols-4 gap-x-2 border-b border-ink-line/60 py-1.5 font-mono text-[10px]">
              <span className="text-right text-paper-dim">{d.bq}</span>
              <span className={`text-right ${up}`}>{d.bp}</span>
              <span className={`text-right ${down}`}>{d.ap}</span>
              <span className="text-right text-paper-dim">{d.aq}</span>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

/* Gold & Silver — live and public, so the real thing. */
function GoldSilverScreen() {
  return (
    <div className="w-full overflow-hidden rounded-md border border-ink-line bg-ink shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)]">
      <div className="flex items-center gap-3 border-b border-ink-line bg-ink-soft px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ink-line" />
          <span className="h-2 w-2 rounded-full bg-ink-line" />
          <span className="h-2 w-2 rounded-full bg-accent" />
        </div>
        <span className="flex-1 truncate rounded-sm bg-ink px-3 py-1 font-mono text-[10px] text-paper-dim">
          goldsilver-brown.vercel.app
        </span>
      </div>
      {/* Fixed viewport (sync with screen-pan's 16rem) so the tall
          capture doesn't swallow the whole card and hide the backdrop. */}
      <div className="h-64 overflow-hidden">
        <Image
          src={goldSilverShot}
          alt=""
          placeholder="blur"
          className="animate-screen-pan block w-full"
          sizes="(min-width: 768px) 40rem, 100vw"
        />
      </div>
    </div>
  );
}

/* K Cha News — bilingual Nepali news reader. */
function KChaScreen() {
  const stories = [
    { h: "NRB holds policy rate steady at 5.5% for Q1", s: "Kathmandu Post · 10 min", np: false },
    { h: "निक्षेपको ब्याजदरमा बैंकहरूबीच प्रतिस्पर्धा सुरु", s: "कान्तिपुर · २० मिनेट", np: true },
    { h: "NEPSE crosses 2,150 as banking leads rally", s: "Share Sansar · 32 min", np: false },
    { h: "एसिया कपका लागि नेपाली टोली घोषणा", s: "अनलाइनखबर · १ घण्टा", np: true },
  ];
  return (
    <PhoneFrame>
      <div className="px-5 pt-3 pb-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[14px] font-bold text-paper">के छ?</span>
          <span className="flex border border-ink-line font-mono text-[9px]">
            <span className="animate-kcha-en bg-paper px-2 py-1 font-bold text-ink">EN</span>
            <span className="animate-kcha-ne px-2 py-1 text-paper-dim">ने</span>
          </span>
        </div>
        <div className="mb-3 flex gap-1.5">
          <Chip tone="accent">Today</Chip>
          <Chip>Finance</Chip>
          <Chip>World</Chip>
        </div>
        {stories.map((st) => (
          <div key={st.h} className="border-t border-ink-line py-2.5">
            <p className="text-[11px] leading-snug font-medium text-paper">{st.h}</p>
            <p className="mt-1 font-mono text-[9px] text-paper-dim">{st.s}</p>
          </div>
        ))}
        <p className="mt-2 font-mono text-[8px] tracking-wider text-paper-dim uppercase">
          35+ newsrooms · offline-ready
        </p>
      </div>
    </PhoneFrame>
  );
}

/* ---------------------------------------------------------------- */

const SCREENS: Record<string, () => ReactNode> = {
  "capital-market": CapitalMarketScreen,
  "brish-terminal": BrishScreen,
  "global-smart-plus": SmartPlusScreen,
  "global-biznex": BiznexScreen,
  "global-junior": JuniorScreen,
  "sani-securities": SaniScreen,
  "gold-silver": GoldSilverScreen,
  "k-cha-news": KChaScreen,
};

export function ProjectScreen({ slug, className }: { slug: string; className?: string }) {
  const Screen = SCREENS[slug];
  if (!Screen) return null;
  return (
    <div aria-hidden className={className}>
      <Screen />
    </div>
  );
}
