"use client";

/* Product screens for the project cards and case studies.

   Most of this work ships inside other companies' banking apps — there is
   no public page to screenshot — so each project gets a hand-built replica
   of its actual UI, framed in the device it really runs on: a phone for
   the app modules, a browser for the web platforms. Gold & Silver is live
   and public, so it uses a real capture (public/work/gold-silver.jpg).
   They're decorative (the card copy already names the product), hence
   aria-hidden at the root.

   The screens are LIVE mockups: a small shared ticker (useTick) advances
   every couple of seconds and every value on screen is a pure function of
   that tick — prices wiggle, balances move, tasks complete, headlines
   switch language. Tick 0 renders identically on server and client, so
   hydration can never mismatch, and reduced-motion visitors keep tick 0
   forever: a still screen. Slow ambient motion (bars, marquee, sheen)
   stays in CSS — see "Product-screen motion" in globals.css. */

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { useLive } from "@/lib/use-live";
import goldSilverShot from "../../public/work/gold-silver.jpg";

/* ---------------------------------------------------------------- */
/* The heartbeat                                                     */
/* ---------------------------------------------------------------- */

function useTick(ms: number) {
  const [tick, setTick] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [ms, reduced]);
  return tick;
}

/* Nepali/Indian digit grouping: 12,45,680 — last three, then pairs. */
function npr(n: number, decimals = 0): string {
  const sign = n < 0 ? "-" : "";
  const [int, frac] = Math.abs(n).toFixed(decimals).split(".");
  const last3 = int.slice(-3);
  const rest = int.slice(0, -3);
  const grouped = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3 : last3;
  return sign + (frac ? `${grouped}.${frac}` : grouped);
}

const wave = (t: number, amp: number, freq: number, phase = 0) =>
  amp * Math.sin(freq * t + phase);

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

/* Capital Market — the stock module inside IME Pay / Khalti / GIBL.
   The portfolio revalues on every tick, exactly like the real module:
   value, today's P&L, the NEPSE index, and each holding's price move
   together, derived — never stored. */
function CapitalMarketScreen() {
  const t = useTick(2000);
  const live = useLive();

  const value = 1245680 + Math.round(wave(t, 26000, 0.6) + wave(t, 7000, 1.9)) + t * 120;
  const today = value - 1245680 + 18240;
  const todayPct = (today / (value - today)) * 100;

  /* The index chip is REAL when /api/live delivers: the actual NEPSE
     point and its actual direction. The mock oscillator only stands in
     while (or if) the fetch hasn't landed. */
  const nepse = live?.nepse ? live.nepse.value : 2146.32 + wave(t, 6.5, 0.9) + wave(t, 1.8, 2.6);
  const nepseUp = live?.nepse
    ? live.nepse.change >= 0
    : nepse >= 2146.32 + wave(t - 1, 6.5, 0.9) + wave(t - 1, 1.8, 2.6);

  const holdings = [
    { s: "NABIL", q: "512 kitta", ltp: 498.5, chg: 1.24 },
    { s: "GBIME", q: "1,040 kitta", ltp: 312.0, chg: 2.08 },
    { s: "NICA", q: "260 kitta", ltp: 871.2, chg: -0.83 },
    { s: "HIDCL", q: "800 kitta", ltp: 214.9, chg: 0.42 },
  ].map((h, i) => {
    const chg = h.chg + wave(t, 0.35, 1.5, i * 1.3);
    return {
      ...h,
      ltpNow: (h.ltp * (1 + 0.003 * Math.sin(t * 1.1 + i * 1.7))).toFixed(2),
      chgNow: `${chg >= 0 ? "+" : ""}${chg.toFixed(2)}%`,
      good: chg >= 0,
    };
  });

  return (
    <PhoneFrame>
      <div className="px-5 pt-3 pb-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[13px] font-bold text-paper">Portfolio</span>
          <Chip tone="accent">
            NEPSE {npr(nepse, 2)} {nepseUp ? "▲" : "▼"}
          </Chip>
        </div>
        <p className="font-mono text-[9px] tracking-wider text-paper-dim uppercase">Total value</p>
        <p className="mt-1 text-[22px] font-bold text-paper">NPR {npr(value)}</p>
        <p className={`animate-screen-blink mt-0.5 font-mono text-[10px] ${today >= 0 ? up : down}`}>
          {today >= 0 ? "+" : ""}
          {npr(today)} today · {today >= 0 ? "+" : ""}
          {todayPct.toFixed(2)}%
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
              <p className="font-mono text-[11px] text-paper">{h.ltpNow}</p>
              <p className={`font-mono text-[9px] ${h.good ? up : down}`}>{h.chgNow}</p>
            </div>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

/* Brish Terminal — live floorsheet + whale radar, with the portfolio
   strip the product actually leads with: what you hold, what it's
   worth, and whether you're beating the index. */
function BrishScreen() {
  const t = useTick(1800);
  const rows = [
    { sym: "NABIL", b: "58", s: "44", qty: "25,000", rate: "501.00", whale: true },
    { sym: "NIFRA", b: "36", s: "42", qty: "3,200", rate: "312.10", whale: false },
    { sym: "SCB", b: "44", s: "58", qty: "1,150", rate: "428.00", whale: false },
    { sym: "GBIME", b: "42", s: "36", qty: "8,600", rate: "311.80", whale: false },
    { sym: "UPPER", b: "51", s: "49", qty: "12,400", rate: "188.20", whale: true },
    { sym: "NICA", b: "49", s: "51", qty: "940", rate: "870.00", whale: false },
  ];

  const pv = 842600 + Math.round(wave(t, 5200, 0.8) + wave(t, 1400, 2.1));
  const vsNepse = 4.2 + wave(t, 0.4, 1.2);

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

        {/* Portfolio strip: holdings and performance, revalued per tick. */}
        <div className="mb-2 flex items-center justify-between gap-3 border border-ink-line bg-ink-soft px-2.5 py-1.5 font-mono text-[9px]">
          <span className="text-paper-dim">
            PORTFOLIO <span className="font-bold text-paper">NPR {npr(pv)}</span>
          </span>
          <span className="hidden text-paper-dim sm:inline">
            NABIL 512 · GBIME 1,040 · UPPER 2,400
          </span>
          <span className={vsNepse >= 0 ? up : down}>
            {vsNepse >= 0 ? "+" : ""}
            {vsNepse.toFixed(1)}% vs NEPSE
          </span>
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
        <div className="relative h-[144px] overflow-hidden">
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
          1.2L @ 188 · portfolio vs NEPSE {vsNepse >= 0 ? "+" : ""}
          {vsNepse.toFixed(1)}%
        </p>
      </div>
    </BrowserFrame>
  );
}

/* Global Smart Plus — retail omni-channel banking. Money moves both
   ways: a rotating feed of received/sent transactions, and a balance
   that reacts to each one. */
const SMART_POOL = [
  { t: "Received — Ama", v: 5000 },
  { t: "Sent — Sagar Thapa", v: -1200 },
  { t: "NEA Electricity Bill", v: -1240 },
  { t: "Received — Daraz refund", v: 2500 },
  { t: "Topup — NTC", v: -500 },
  { t: "Sent — Fonepay QR", v: -850 },
];

function SmartPlusScreen() {
  const t = useTick(2500);
  const idx = (k: number) => ((k % SMART_POOL.length) + SMART_POOL.length) % SMART_POOL.length;

  /* Balance = base + everything applied so far this cycle, so the number
     the card shows always agrees with the feed below it. */
  const balance =
    84520.75 + SMART_POOL.slice(0, idx(t) + 1).reduce((sum, txn) => sum + txn.v, 0);
  const latest = SMART_POOL[idx(t)];
  const visible = [0, 1, 2].map((o) => SMART_POOL[idx(t - o)]);

  return (
    <PhoneFrame>
      <div className="px-5 pt-3 pb-5">
        <p className="text-[13px] font-bold text-paper">Good morning, Subash</p>
        <div className="relative mt-3 overflow-hidden rounded-md border border-accent/40 bg-accent/15 p-4">
          <span className="animate-screen-sheen pointer-events-none absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-paper/10 to-transparent" />
          <p className="font-mono text-[9px] tracking-wider text-paper-dim uppercase">
            Savings · 001·····212
          </p>
          <p className="mt-1.5 text-[20px] font-bold text-paper">NPR {npr(balance, 2)}</p>
          <p className="mt-0.5 font-mono text-[9px] text-paper-dim">
            Available balance{" "}
            <span className={latest.v >= 0 ? up : down}>
              {latest.v >= 0 ? "▲" : "▼"} {npr(Math.abs(latest.v))}
            </span>
          </p>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {["Send", "Receive", "Scan", "More"].map((a) => (
            <div key={a} className="border border-ink-line py-2.5 text-center">
              <span className="mx-auto mb-1 block h-3 w-3 border border-accent-bright" />
              <span className="font-mono text-[8px] tracking-wider text-paper-dim uppercase">{a}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 mb-1 font-mono text-[9px] tracking-wider text-paper-dim uppercase">Recent</p>
        {visible.map((txn, o) => (
          <div
            key={`${t - o}-${txn.t}`}
            className={`flex items-center justify-between border-t border-ink-line py-2.5 ${
              o === 0 ? "animate-screen-appear bg-accent/10 px-1.5" : ""
            }`}
          >
            <span className="truncate pr-3 text-[11px] text-paper">
              <span className={`mr-1.5 font-mono ${txn.v >= 0 ? up : "text-paper-dim"}`}>
                {txn.v >= 0 ? "↓" : "↑"}
              </span>
              {txn.t}
            </span>
            <span className={`font-mono text-[10px] ${txn.v >= 0 ? up : "text-paper-dim"}`}>
              {txn.v >= 0 ? "+" : "-"}
              {npr(Math.abs(txn.v))}.00
            </span>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

/* Global Biznex — corporate banking. The batch validates in real time
   and the top instruction walks the maker–checker ladder: pending →
   approved → released. */
function BiznexScreen() {
  const t = useTick(2000);
  const validated = Math.min(1204, 936 + ((t * 67) % 336));
  const ladder = [
    { status: "Pending checker", tone: "amber" as const },
    { status: "Approved", tone: "accent" as const },
    { status: "Released", tone: "green" as const },
  ];
  const blk = ladder[t % 3];
  const queue = [
    { ref: "BLK-4021", ben: "Payroll · 1,204 transfers", amt: "48,16,000", ...blk },
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
            <span className="font-mono text-[9px] text-paper-dim">
              {npr(validated)} / 1,204 validated
            </span>
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

/* Global Junior — child banking. Tasks complete one by one, each reward
   lands in the bicycle fund, and the cycle resets — money visibly goes
   up and (on reset) back down, like a week of chores. */
const JUNIOR_TASKS = [
  { t: "Make your bed", r: 50 },
  { t: "Finish homework", r: 100 },
  { t: "Water the plants", r: 50 },
];

function JuniorScreen() {
  const t = useTick(2200);
  /* +2 so tick 0 shows two tasks done / NPR 6,400 — the classic frame. */
  const done = (t + 2) % 4;
  const saved = 6250 + JUNIOR_TASKS.slice(0, done).reduce((sum, task) => sum + task.r, 0);
  const pct = saved / 100;

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
            <span className="font-mono text-[10px] text-accent-bright">{Math.round(pct)}%</span>
          </div>
          <p className="mt-1.5 text-[16px] font-bold text-paper">
            NPR {npr(saved)} <span className="text-[11px] font-normal text-paper-dim">/ 10,000</span>
          </p>
          <div className="mt-2 h-1 w-full bg-ink-line">
            <div
              className="h-1 bg-accent-bright transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <p className="mt-4 mb-1 font-mono text-[9px] tracking-wider text-paper-dim uppercase">
          Today&apos;s tasks
        </p>
        {JUNIOR_TASKS.map((task, i) => {
          const isDone = i < done;
          return (
            <div key={task.t} className="flex items-center justify-between border-t border-ink-line py-2.5">
              <span className="flex items-center gap-2.5 text-[11px] text-paper">
                <span
                  className={`inline-block h-3 w-3 border transition-colors duration-500 ${
                    isDone ? "border-emerald-400 bg-emerald-400/70" : "border-ink-line"
                  }`}
                />
                {task.t}
              </span>
              <span className={`font-mono text-[10px] ${isDone ? up : "text-paper-dim"}`}>
                +{task.r}
              </span>
            </div>
          );
        })}
        <p className="mt-3 border border-ink-line px-3 py-2 font-mono text-[9px] text-paper-dim">
          Daily spend limit NPR 500 — set by parent
        </p>
      </div>
    </PhoneFrame>
  );
}

/* Sani Securities — brokerage. The desk rotates through symbols, depth
   re-centres on each one, and the ticket flips between buy and sell. */
const SANI_SYMBOLS = [
  { s: "NABIL", ltp: 498.5 },
  { s: "GBIME", ltp: 312.0 },
  { s: "NIFRA", ltp: 188.2 },
];
const SANI_QTYS = [
  { bq: "1,200", aq: "860" },
  { bq: "2,450", aq: "1,340" },
  { bq: "980", aq: "2,100" },
  { bq: "3,600", aq: "5,000" },
];

function SaniScreen() {
  const t = useTick(2400);
  const symbol = SANI_SYMBOLS[Math.floor(t / 2) % SANI_SYMBOLS.length];
  const buying = t % 2 === 0;
  const ltp = symbol.ltp * (1 + 0.002 * Math.sin(t * 1.3));

  return (
    <BrowserFrame url="tms.sanisecurities.com.np/trade">
      <div className="grid grid-cols-[0.9fr_1.1fr] gap-4 px-4 py-3">
        <div>
          <div className="mb-2 grid grid-cols-2 gap-1">
            <span
              className={`py-1.5 text-center font-mono text-[10px] transition-colors duration-300 ${
                buying ? "bg-accent font-bold text-paper" : "border border-ink-line text-paper-dim"
              }`}
            >
              BUY
            </span>
            <span
              className={`py-1.5 text-center font-mono text-[10px] transition-colors duration-300 ${
                buying ? "border border-ink-line text-paper-dim" : "bg-red-400 font-bold text-ink"
              }`}
            >
              SELL
            </span>
          </div>
          {[
            { k: "Symbol", v: symbol.s },
            { k: "Quantity", v: "500" },
            { k: "Price", v: ltp.toFixed(2) },
          ].map((f) => (
            <div key={f.k} className="mb-1.5 flex items-center justify-between border border-ink-line px-2.5 py-1.5">
              <span className="font-mono text-[8px] tracking-wider text-paper-dim uppercase">{f.k}</span>
              <span className="font-mono text-[10px] text-paper">{f.v}</span>
            </div>
          ))}
          <span
            className={`mt-1 block border py-1.5 text-center font-mono text-[9px] tracking-wider uppercase transition-colors duration-300 ${
              buying ? "border-accent-bright text-accent-bright" : "border-red-400 text-red-400"
            }`}
          >
            Place {buying ? "buy" : "sell"} order
          </span>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-paper uppercase">
              Depth — {symbol.s}
            </span>
            <span className={`animate-screen-blink font-mono text-[9px] ${up}`}>
              LTP {ltp.toFixed(2)}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-x-2 border-b border-ink-line pb-1 font-mono text-[8px] tracking-wider text-paper-dim uppercase">
            <span className="text-right">Bid qty</span>
            <span className="text-right">Bid</span>
            <span className="text-right">Ask</span>
            <span className="text-right">Ask qty</span>
          </div>
          {SANI_QTYS.map((d, i) => (
            <div key={d.bq} className="grid grid-cols-4 gap-x-2 border-b border-ink-line/60 py-1.5 font-mono text-[10px]">
              <span className="text-right text-paper-dim">{d.bq}</span>
              <span className={`text-right ${up}`}>{(ltp - (i + 1) * 0.4).toFixed(2)}</span>
              <span className={`text-right ${down}`}>{(ltp + (i + 1) * 0.45).toFixed(2)}</span>
              <span className="text-right text-paper-dim">{d.aq}</span>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

/* Gold & Silver — live and public, so the real thing twice over: the
   full-page capture slowly pans inside a fixed viewport, and the strip
   above it shows ACTUAL prices — international spot converted at Nepal
   Rastra Bank's official rate, served by /api/live on a 5-minute cache. */
function GoldSilverScreen() {
  const live = useLive();
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
      {live?.gold && (
        <div className="flex items-center justify-between gap-3 border-b border-ink-line bg-ink-soft/60 px-4 py-2 font-mono text-[9px]">
          <span className="flex items-center gap-2 truncate text-paper">
            <span className="animate-screen-pulse h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            GOLD {npr(live.gold)}
            <span className="text-paper-dim">/tola</span>
            {live.silver && (
              <>
                · SILVER {npr(live.silver)}
                <span className="text-paper-dim">/tola</span>
              </>
            )}
          </span>
          <span className="shrink-0 text-paper-dim">
            live spot × NRB{live.usdNpr ? ` ${live.usdNpr.toFixed(2)}` : ""}
          </span>
        </div>
      )}
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

/* K Cha News — bilingual reader. The whole feed trades languages with
   the toggle: same stories, both scripts, because the product's point
   is that switching never loses your place. */
const KCHA_STORIES = [
  {
    en: { h: "NRB holds policy rate steady at 5.5% for Q1", s: "Kathmandu Post · 10 min" },
    ne: { h: "एनआरबीले नीतिगत दर ५.५% मा यथावत् राख्यो", s: "काठमाडौं पोस्ट · १० मिनेट" },
  },
  {
    en: { h: "Deposit-rate competition heats up among banks", s: "Kantipur · 20 min" },
    ne: { h: "निक्षेपको ब्याजदरमा बैंकहरूबीच प्रतिस्पर्धा सुरु", s: "कान्तिपुर · २० मिनेट" },
  },
  {
    en: { h: "NEPSE crosses 2,150 as banking leads rally", s: "Share Sansar · 32 min" },
    ne: { h: "बैंकिङ क्षेत्रको उछालसँगै नेप्से २,१५० माथि", s: "सेयर संसार · ३२ मिनेट" },
  },
  {
    en: { h: "Nepal squad announced for Asia Cup", s: "Onlinekhabar · 1 hr" },
    ne: { h: "एसिया कपका लागि नेपाली टोली घोषणा", s: "अनलाइनखबर · १ घण्टा" },
  },
];

function KChaScreen() {
  const t = useTick(3500);
  const nepali = t % 2 === 1;
  const tabs = nepali ? ["आज", "अर्थ", "विश्व"] : ["Today", "Finance", "World"];

  return (
    <PhoneFrame>
      <div className="px-5 pt-3 pb-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[14px] font-bold text-paper">के छ?</span>
          <span className="flex border border-ink-line font-mono text-[9px]">
            <span
              className={`px-2 py-1 transition-colors duration-300 ${
                nepali ? "text-paper-dim" : "bg-paper font-bold text-ink"
              }`}
            >
              EN
            </span>
            <span
              className={`px-2 py-1 transition-colors duration-300 ${
                nepali ? "bg-paper font-bold text-ink" : "text-paper-dim"
              }`}
            >
              ने
            </span>
          </span>
        </div>
        <div className="mb-3 flex gap-1.5">
          {tabs.map((tab, i) => (
            <Chip key={tab} tone={i === 0 ? "accent" : "dim"}>
              {tab}
            </Chip>
          ))}
        </div>
        <div key={nepali ? "ne" : "en"} className="animate-screen-appear">
          {KCHA_STORIES.map((story) => {
            const s = nepali ? story.ne : story.en;
            return (
              <div key={story.en.h} className="border-t border-ink-line py-2.5">
                <p className="text-[11px] leading-snug font-medium text-paper">{s.h}</p>
                <p className="mt-1 font-mono text-[9px] text-paper-dim">{s.s}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-2 font-mono text-[8px] tracking-wider text-paper-dim uppercase">
          {nepali ? "३५+ न्युजरुम · अफलाइनमै पढ्न मिल्ने" : "35+ newsrooms · offline-ready"}
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
