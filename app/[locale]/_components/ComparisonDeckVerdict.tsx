'use client';

import { Sparkles, AlertCircle } from 'lucide-react';

interface VerdictData {
  text: string;
}

interface ComparisonDeckVerdictProps {
  verdict: VerdictData | null;
  carCount: number;
}

export default function ComparisonDeckVerdict({ verdict, carCount }: ComparisonDeckVerdictProps) {
  return (
    <>
      {verdict && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 dark:border-emerald-500/30 dark:bg-emerald-950/10">
          <div className="flex gap-3">
            <Sparkles className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h4 className="font-sans text-sm font-bold text-neutral-900 dark:text-white">autod.pro Advisory verdict</h4>
              <p className="mt-1 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">{verdict.text}</p>
            </div>
          </div>
        </div>
      )}

      {carCount < 2 && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Select at least 2 cars to activate the Automated Financial Advisor recommendation.</span>
        </div>
      )}
    </>
  );
}
