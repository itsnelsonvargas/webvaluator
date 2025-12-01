"use client";

import { useState } from "react";
import { EstimatorForm } from "./components/EstimatorForm";
import { ResultCard } from "./components/ResultCard";
import type { CostCalculationResult } from "./lib/types";

export default function HomePage() {
  const [result, setResult] = useState<CostCalculationResult | null>(null);

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">WebValuator</h1>
          <p className="mt-2 text-muted-foreground">
            Generate an accurate cost estimate for your website project
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <EstimatorForm onCalculate={setResult} />
          {result && <ResultCard result={result} />}
        </div>
      </div>
    </main>
  );
}

