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
          <p className="mt-2 text-sm text-muted-foreground">
            Contact: <a href="mailto:itsnelsonvargas@gmail.com" className="text-blue-600 hover:text-blue-800 underline">
              itsnelsonvargas@gmail.com
            </a>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <EstimatorForm onCalculate={setResult} />
          {result && <ResultCard result={result} />}
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-border">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              WebValuator - Professional Website Cost Estimation
            </p>
            <p className="text-sm mt-2">
              For questions or custom quotes:
              <a href="mailto:itsnelsonvargas@gmail.com" className="text-blue-600 hover:text-blue-800 underline ml-1">
                itsnelsonvargas@gmail.com
              </a>
            </p>
            <p className="text-xs mt-4 text-muted-foreground">
              © 2025 WebValuator. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}

