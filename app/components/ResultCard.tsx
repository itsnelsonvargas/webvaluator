"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CostCalculationResult } from "../lib/types";

const addonLabels: Record<string, string> = {
  pia: "Project Initial Analysis (PIA)",
  va: "Virtual Assistant (VA)",
  uat: "User Acceptance Testing (UAT)",
  seo: "SEO Setup",
  adminDash: "Admin Dashboard",
  api: "API Integration",
  uiux: "UI/UX Designer Included",
};

interface ResultCardProps {
  result: CostCalculationResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const subtotal =
    result.breakdown.baseCost * result.breakdown.complexityMultiplier +
    Object.values(result.breakdown.addons).reduce((sum, price) => sum + price, 0) +
    (result.breakdown.hosting || 0) +
    (result.breakdown.domain || 0) +
    (result.breakdown.maintenance || 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Estimate</CardTitle>
        <CardDescription>Detailed breakdown of your project cost</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Base Cost */}
          <div className="flex justify-between text-sm">
            <span>Base Cost</span>
            <span>{formatCurrency(result.breakdown.baseCost)}</span>
          </div>

          {/* Complexity Multiplier */}
          {result.breakdown.complexityMultiplier !== 1 && (
            <div className="flex justify-between text-sm">
              <span>
                Complexity Multiplier ({result.breakdown.complexityMultiplier}x)
              </span>
              <span>
                {formatCurrency(
                  result.breakdown.baseCost * result.breakdown.complexityMultiplier -
                    result.breakdown.baseCost
                )}
              </span>
            </div>
          )}

          {/* Add-ons */}
          {Object.keys(result.breakdown.addons).length > 0 && (
            <div className="space-y-1">
              <div className="text-sm font-medium">Add-ons:</div>
              {Object.entries(result.breakdown.addons).map(([addon, price]) => (
                <div key={addon} className="flex justify-between text-sm pl-4">
                  <span className="text-muted-foreground">
                    {addonLabels[addon] || addon}
                  </span>
                  <span>{formatCurrency(price)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Hosting */}
          {result.breakdown.hosting && (
            <div className="flex justify-between text-sm">
              <span>Hosting</span>
              <span>{formatCurrency(result.breakdown.hosting)}</span>
            </div>
          )}

          {/* Domain */}
          {result.breakdown.domain && (
            <div className="flex justify-between text-sm">
              <span>Domain</span>
              <span>{formatCurrency(result.breakdown.domain)}</span>
            </div>
          )}

          {/* Maintenance */}
          {result.breakdown.maintenance && (
            <div className="flex justify-between text-sm">
              <span>Maintenance</span>
              <span>{formatCurrency(result.breakdown.maintenance)}</span>
            </div>
          )}

          {/* Timeline Multiplier */}
          {result.breakdown.timelineMultiplier !== 1 && (
            <div className="flex justify-between text-sm">
              <span>
                Timeline Multiplier ({result.breakdown.timelineMultiplier}x)
              </span>
              <span>
                {formatCurrency(subtotal * result.breakdown.timelineMultiplier - subtotal)}
              </span>
            </div>
          )}

          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(result.total)}</span>
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          variant="outline"
          onClick={() => {
            // Placeholder for PDF generation
            alert("PDF generation feature coming soon!");
          }}
        >
          Generate PDF Estimate
        </Button>
      </CardContent>
    </Card>
  );
}

