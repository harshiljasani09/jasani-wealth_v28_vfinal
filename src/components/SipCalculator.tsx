import { lazy, Suspense, useMemo, useState } from "react";

const SipChart = lazy(() => import("./SipChart"));


const DEFAULTS: Record<"monthly" | "lumpsum" | "years" | "rate" | "stepUp", number> = {
  monthly: 25000,
  lumpsum: 500000,
  years: 15,
  rate: 12,
  stepUp: 10,
};

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));


const compact = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)}Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
  if (n >= 1e3) return `₹${Math.round(n / 1e3)}K`;
  return `₹${Math.round(n)}`;
};

/** Annualised IRR (%) from a series of equally spaced monthly cash flows. */
function xirr(monthlyFlows: number[]) {
  const npv = (r: number) => monthlyFlows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + r, t), 0);
  let lo = -0.9999;
  let hi = 1;
  if (npv(lo) * npv(hi) > 0) return 0;
  for (let k = 0; k < 300; k++) {
    const mid = (lo + hi) / 2;
    if (npv(lo) * npv(mid) <= 0) hi = mid;
    else lo = mid;
  }
  const monthly = (lo + hi) / 2;
  return (Math.pow(1 + monthly, 12) - 1) * 100;
}

function CheckToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex flex-1 items-center gap-3 rounded-md border px-4 py-3 text-left transition-colors ${
        checked ? "border-gold bg-gold/10" : "border-cream/20 hover:border-gold/50"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border transition-colors ${
          checked ? "border-gold bg-gold text-navy-deep" : "border-cream/35 text-transparent"
        }`}
        aria-hidden
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M3 8.5l3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={`eyebrow ${checked ? "text-gold" : "text-cream/60"}`}>{label}</span>
    </button>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors ${
        checked ? "border-gold bg-gold/70" : "border-cream/25 bg-cream/10"
      }`}
    >
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-all ${
          checked ? "left-6 bg-navy-deep" : "left-1 bg-cream/60"
        }`}
      />
    </button>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
  action,
  disabled = false,
  defaultValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (v: number) => void;
  action?: React.ReactNode;
  disabled?: boolean;
  defaultValue: number;
}) {
  const [blank, setBlank] = useState(false);
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const isCurrency = suffix === "₹";
  return (
    <div className={disabled ? "opacity-40" : ""}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-3">
        <span className={`eyebrow flex min-w-0 flex-wrap items-center gap-3 ${disabled ? "text-cream/35" : "text-cream/60"}`}>
          {label}
          {action}
        </span>
        <div
          className={`flex w-[9.5rem] shrink-0 items-center gap-2 rounded-md border px-3 py-1.5 sm:w-[11.5rem] ${
            disabled ? "border-cream/15 bg-cream/[0.02]" : "border-gold/30 bg-cream/5"
          }`}
        >
          <span className={`w-4 shrink-0 font-display text-lg ${disabled ? "text-cream/35" : "text-gold"}`}>
            {isCurrency ? "₹" : ""}
          </span>
          <input
            type={isCurrency ? "text" : "number"}
            inputMode="numeric"
            disabled={disabled}
            aria-label={`${label} value`}
            {...(isCurrency ? {} : { min, max, step })}
            value={blank ? "" : isCurrency ? inr(value) : value}
            onChange={(e) => {
              const raw = isCurrency ? e.target.value.replace(/[^0-9]/g, "") : e.target.value;
              if (raw === "") {
                setBlank(true);
                return;
              }
              setBlank(false);
              onChange(clamp(Number(raw)));
            }}
            onBlur={() => {
              if (blank) {
                setBlank(false);
                onChange(clamp(defaultValue));
              }
            }}
            className={`min-w-0 flex-1 bg-transparent text-right font-display text-2xl outline-none [appearance:textfield] sm:text-3xl [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
              disabled ? "text-cream/35" : "text-gold"
            }`}
          />
          {suffix !== "₹" && (
            <span
              className={`w-6 shrink-0 text-right font-display text-base ${disabled ? "text-cream/35" : "text-gold"}`}
            >
              {suffix.trim()}
            </span>
          )}
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          setBlank(false);
          onChange(Number(e.target.value));
        }}
        className={`mt-4 h-[3px] w-full appearance-none rounded-full bg-cream/20 accent-gold outline-none ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      />
    </div>
  );
}



function Stepper({
  label,
  value,
  min,
  max,
  step,
  onChange,
  action,
  disabled = false,
  defaultValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  action?: React.ReactNode;
  disabled?: boolean;
  defaultValue: number;
}) {
  const [blank, setBlank] = useState(false);
  const clamp = (v: number) => Math.min(max, Math.max(min, Number(v.toFixed(2))));

  return (
    <div className={disabled ? "opacity-40" : ""}>
      <div className="flex items-center justify-between gap-3">
        <span className={`eyebrow ${disabled ? "text-cream/35" : "text-cream/60"}`}>{label}</span>
        {action}
      </div>
      <div
        className={`mt-3 flex items-center justify-between rounded-md border px-3 py-2 ${
          disabled ? "border-cream/15 bg-cream/[0.02]" : "border-gold/30 bg-cream/5"
        }`}
      >
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={disabled}
          onClick={() => onChange(clamp(value - step))}
          className={`flex h-7 w-7 items-center justify-center rounded-full border text-lg leading-none ${
            disabled ? "border-cream/15 text-cream/25" : "border-gold/40 text-gold hover:bg-gold/10"
          }`}
        >
          −
        </button>
        <input
          type="number"
          inputMode="decimal"
          aria-label={label}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          value={blank ? "" : value}
          onChange={(e) => {
            if (e.target.value === "") {
              setBlank(true);
              return;
            }
            setBlank(false);
            onChange(clamp(Number(e.target.value)));
          }}
          onBlur={() => {
            if (blank) {
              setBlank(false);
              onChange(clamp(defaultValue));
            }
          }}

          className={`min-w-0 flex-1 bg-transparent text-center font-display text-2xl outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
            disabled ? "text-cream/35" : "text-gold"
          }`}
        />
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={disabled}
          onClick={() => onChange(clamp(value + step))}
          className={`flex h-7 w-7 items-center justify-center rounded-full border text-lg leading-none ${
            disabled ? "border-cream/15 text-cream/25" : "border-gold/40 text-gold hover:bg-gold/10"
          }`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export function SipCalculator() {
  const [sipOn, setSipOn] = useState(true);
  const [lumpOn, setLumpOn] = useState(true);
  const [monthly, setMonthly] = useState(DEFAULTS.monthly);
  const [lumpsum, setLumpsum] = useState(DEFAULTS.lumpsum);
  const [years, setYears] = useState(DEFAULTS.years);
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [stepUpOn, setStepUpOn] = useState(false);
  const [stepUp, setStepUp] = useState(DEFAULTS.stepUp);
  const [returnMode, setReturnMode] = useState<"xirr" | "absolute">("absolute");
  const [view, setView] = useState<"chart" | "table">("chart");

  const { invested, corpus, gains, series, xirrPct, absolutePct } = useMemo(() => {
    // SIP: monthly compounding at nominal annual rate / 12 (annuity-due).
    // Lump sum: annual compounding at the stated annual rate.
    const i = rate / 100 / 12;
    const a = rate / 100;

    const baseM = sipOn ? monthly : 0;
    const l = lumpOn ? lumpsum : 0;
    const g = sipOn && stepUpOn ? stepUp / 100 : 0;
    const months = years * 12;

    let sipBal = 0;
    let paid = l;
    const flows: number[] = new Array(months + 1).fill(0);
    flows[0] = -l;
    const data: { year: number; invested: number; corpus: number }[] = [
      { year: 0, invested: paid, corpus: l },
    ];

    for (let t = 0; t < months; t++) {
      const instalment = baseM * Math.pow(1 + g, Math.floor(t / 12));
      sipBal += instalment;
      paid += instalment;
      flows[t] = (flows[t] ?? 0) - instalment;
      sipBal *= 1 + i;
      if ((t + 1) % 12 === 0) {
        const y = (t + 1) / 12;
        data.push({ year: y, invested: paid, corpus: sipBal + l * Math.pow(1 + a, y) });
      }
    }
    const balance = sipBal + l * Math.pow(1 + a, years);
    flows[months] = (flows[months] ?? 0) + balance;

    return {
      invested: paid,
      corpus: balance,
      gains: balance - paid,
      series: data,
      xirrPct: paid > 0 ? xirr(flows) : 0,
      absolutePct: paid > 0 ? ((balance - paid) / paid) * 100 : 0,
    };
  }, [monthly, lumpsum, years, rate, sipOn, lumpOn, stepUpOn, stepUp]);

  const xTicks = useMemo(() => {
    const span = Math.max(1, Math.round(years));
    if (span <= 10) {
      const ticks: number[] = [];
      for (let y = 0; y <= span; y++) ticks.push(y);
      return ticks;
    }

    // Aim for ~6 evenly-spaced segments. Prefer an integer step that divides
    // the span so the final year lines up; fall back to a rounded step when
    // no divisor is close to the target.
    const targetSegments = 6;
    const targetStep = span / targetSegments;
    let step = 1;
    let minDiff = Infinity;
    for (let d = 1; d <= span; d++) {
      if (span % d === 0) {
        const diff = Math.abs(d - targetStep);
        if (diff < minDiff) {
          minDiff = diff;
          step = d;
        }
      }
    }
    if (minDiff > targetStep / 2) {
      step = Math.max(1, Math.round(targetStep));
    }

    const ticks: number[] = [];
    for (let y = 0; y <= span; y += step) ticks.push(y);
    const last = ticks[ticks.length - 1]!;
    // On small screens a final partial step (e.g. 18 & 19) overlaps the
    // previous label, so only show the end year when it is spaced well.
    if (last !== span && span - last >= step * 0.9) ticks.push(span);
    return ticks;
  }, [years]);


  return (
    <div className="sip-calculator space-y-10">
      <div className="grid overflow-hidden rounded-lg border border-gold/30 bg-navy-deep/95 shadow-[var(--shadow-royal)] backdrop-blur-md lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8 border-b border-gold/20 p-8 sm:p-10 lg:border-b-0 lg:border-r">
          <p className="eyebrow text-center text-cream/45">Select your investment type(s)</p>

          <div className="border-t border-gold/15">
            <div className="grid grid-cols-2 gap-4 py-8">
              <CheckToggle label="SIP" checked={sipOn} onChange={(v) => (v || lumpOn) && setSipOn(v)} />
              <CheckToggle label="Lump Sum" checked={lumpOn} onChange={(v) => (v || sipOn) && setLumpOn(v)} />
            </div>
            <div className="grid gap-8 border-t border-gold/15 pt-8 lg:grid-cols-2 lg:gap-x-10">
              <Slider
                label="Monthly Investment"
                value={monthly}
                min={1000}
                max={1000000}
                step={1000}
                suffix="₹"
                onChange={setMonthly}
                disabled={!sipOn}
                defaultValue={DEFAULTS.monthly}
              />
              <Slider
                label="Lump Sum"
                value={lumpsum}
                min={0}
                max={100000000}
                step={50000}
                suffix="₹"
                onChange={setLumpsum}
                disabled={!lumpOn}
                defaultValue={DEFAULTS.lumpsum}
              />
            </div>
          </div>


          <div className="grid gap-x-8 gap-y-6 border-t border-gold/15 pt-8 sm:grid-cols-2">
            <Stepper
              label="Expected Return Rate (% p.a.)"
              value={rate}
              min={4}
              max={20}
              step={0.5}
              onChange={setRate}
              defaultValue={DEFAULTS.rate}
            />
            <Stepper
              label="Time Period (Years)"
              value={years}
              min={1}
              max={50}
              step={1}
              onChange={setYears}
              defaultValue={DEFAULTS.years}
            />
            <Stepper
              label="Yearly Step-Up (%)"
              value={stepUp}
              min={1}
              max={25}
              step={1}
              onChange={setStepUp}
              defaultValue={DEFAULTS.stepUp}

              disabled={!sipOn || !stepUpOn}
              action={
                <Switch label="Yearly step-up" checked={stepUpOn} onChange={(v) => sipOn && setStepUpOn(v)} />
              }
            />
          </div>
        </div>



        <div className="flex flex-col p-8 sm:p-10">
          <div className="mb-5 flex items-center gap-3">
            <span className="eyebrow text-cream/45">View as</span>
            <div className="flex rounded-md bg-cream/10 p-1">
              {(["chart", "table"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`px-4 py-1 text-[0.65rem] uppercase tracking-[0.10em] transition-all rounded-sm ${
                    view === v
                      ? "bg-gold text-navy-deep font-medium shadow-sm"
                      : "text-cream/60 hover:text-gold"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          {view === "table" ? (
            <div className="relative min-h-[300px] flex-1">
              <div className="absolute inset-0 overflow-y-auto rounded-md border border-gold/20">
                <table className="w-full border-collapse">

                  <thead className="sticky top-0 z-10 bg-navy-deep">
                    <tr className="border-b border-gold/25">
                      <th className="eyebrow px-3 py-2.5 text-center font-normal text-cream/55">Year</th>
                      <th className="eyebrow px-3 py-2.5 text-center font-normal text-cream/55">Invested</th>
                      <th className="eyebrow px-3 py-2.5 text-center font-normal text-cream/55">Wealth Gained</th>
                    </tr>
                  </thead>
                  <tbody>
                    {series.slice(1).map((row) => (
                      <tr
                        key={row.year}
                        className="border-b border-cream/10 last:border-0 odd:bg-cream/5 even:bg-cream/10"
                      >
                        <td className="px-3 py-2 text-center font-display text-lg text-cream/70">{row.year}</td>
                        <td className="px-3 py-2 text-center font-display text-lg text-cream">₹{inr(row.invested)}</td>
                        <td className="px-3 py-2 text-center font-display text-lg text-gold">
                          ₹{inr(row.corpus - row.invested)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (

          <div className="h-full min-h-[300px] w-full">
            <Suspense fallback={<div className="h-full w-full" />}>
              <SipChart series={series} years={years} xTicks={xTicks} />
            </Suspense>
          </div>

          )}
        </div>
      </div>

      <div className="rounded-lg border border-gold/30 bg-navy-deep/95 shadow-[var(--shadow-royal)] backdrop-blur-md p-8 sm:p-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="eyebrow text-cream/60">Projected Corpus</p>
            <p className="mt-3 font-display text-5xl leading-none text-gilt sm:text-6xl">₹{inr(corpus)}</p>
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-cream/15">
              <div
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${corpus > 0 ? Math.min(100, Math.round((gains / corpus) * 100)) : 0}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden />
                <span className="text-[0.75rem] uppercase tracking-[0.10em] text-cream/60">
                  Wealth Gained {corpus > 0 ? Math.round((gains / corpus) * 100) : 0}%
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-cream/25" aria-hidden />
                <span className="text-[0.75rem] uppercase tracking-[0.10em] text-cream/60">
                  Invested {corpus > 0 ? 100 - Math.round((gains / corpus) * 100) : 0}%
                </span>
              </span>
            </div>

          </div>

          <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2 sm:grid-rows-[1fr_1fr] sm:col-span-2 lg:col-span-2">
            <div className="grid grid-cols-[1fr_auto] items-end gap-4 min-h-0 border-b border-gold/20 pb-3">
              <dt className="eyebrow min-w-0 text-cream/55">Total Invested</dt>
              <dd className="min-w-0 font-display text-right text-2xl text-cream sm:text-3xl lg:text-3xl">
                ₹{inr(invested)}
              </dd>
            </div>
            <div className="grid grid-cols-[1fr_auto] items-end gap-4 min-h-0 border-b border-gold/20 pb-3">
              <dt className="eyebrow min-w-0 text-cream/55">Wealth Gained</dt>
              <dd className="min-w-0 font-display text-right text-2xl text-gold sm:text-3xl lg:text-3xl">
                ₹{inr(gains)}
              </dd>
            </div>
            <div className="grid grid-cols-[1fr_auto] items-end gap-4 min-h-0 border-b border-gold/20 pb-3">
              <dt className="eyebrow min-w-0 text-cream/55">
                {returnMode === "xirr" ? "RETURNS (XIRR)" : "returns (absolute)"}
              </dt>
              <dd className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
                <span className="font-display text-right text-2xl text-gold sm:text-3xl">
                  {(returnMode === "xirr" ? xirrPct : absolutePct).toFixed(1)}%
                </span>
                <div className="flex shrink-0 overflow-hidden rounded-md border border-gold/30">
                  {(["absolute", "xirr"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReturnMode(r)}
                      className={`px-2 py-1.5 text-[0.7rem] uppercase tracking-[0.10em] transition-colors sm:px-3 sm:py-2 ${
                        returnMode === r ? "bg-gold/20 text-gold" : "text-cream/50 hover:text-gold"
                      }`}
                    >
                      {r === "xirr" ? "XIRR" : "Abs"}
                    </button>
                  ))}
                </div>
              </dd>
            </div>
            <div className="grid grid-cols-[1fr_auto] items-end gap-4 min-h-0 border-b border-gold/20 pb-3">
              <dt className="eyebrow min-w-0 text-cream/55">Time Period</dt>
              <dd className="min-w-0 font-display text-right text-2xl text-cream sm:text-3xl lg:text-3xl">
                {years} yrs
              </dd>
            </div>
          </dl>
        </div>
        <p className="mt-8 text-sm leading-relaxed text-cream/45">
          Illustrative projection only. Mutual fund investments are subject to market risks; please read all scheme
          related documents carefully.
        </p>
      </div>
    </div>
  );
}
