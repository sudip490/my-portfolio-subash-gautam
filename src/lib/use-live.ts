"use client";

/* Client side of /api/live: one fetch shared by every mounted screen
   (module-level cache + in-flight dedupe), null until it lands or if it
   never does — callers always have a mock fallback. */

import { useEffect, useState } from "react";

export type LiveData = {
  nepse: { value: number; change: number; pct: number } | null;
  gold: number | null;
  silver: number | null;
  usdNpr: number | null;
  asOf: string;
};

let cache: LiveData | null = null;
let pending: Promise<LiveData | null> | null = null;

function load(): Promise<LiveData | null> {
  pending ??= fetch("/api/live")
    .then((res) => (res.ok ? (res.json() as Promise<LiveData>) : null))
    .catch(() => null)
    .then((data) => {
      cache = data;
      return data;
    });
  return pending;
}

export function useLive(): LiveData | null {
  const [data, setData] = useState<LiveData | null>(cache);
  useEffect(() => {
    if (cache) return;
    let alive = true;
    load().then((d) => {
      if (alive && d) setData(d);
    });
    return () => {
      alive = false;
    };
  }, []);
  return data;
}
