"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EstimatorFormData, Addon } from "../lib/types";
import type { CostCalculationResult } from "../lib/types";
import { estimatorFormSchema } from "../lib/types";

const addonLabels: Record<Addon, string> = {
  pia: "Project Initial Analysis (PIA)",
  va: "Virtual Assistant (VA)",
  uat: "User Acceptance Testing (UAT)",
  seo: "SEO Setup",
  adminDash: "Admin Dashboard",
  api: "API Integration",
  uiux: "UI/UX Designer Included",
};

interface EstimatorFormProps {
  onCalculate: (result: CostCalculationResult) => void;
}

export function EstimatorForm({ onCalculate }: EstimatorFormProps) {
  const [formData, setFormData] = useState<Partial<EstimatorFormData>>({
    websiteType: "portfolio",
    numberOfPages: 1,
    complexity: "basic",
    addons: [],
    hosting: "none",
    domain: "none",
    maintenance: "none",
    timeline: "normal",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate form data
      const validatedData = estimatorFormSchema.parse(formData);
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });
      if (!response.ok) throw new Error("Calculation failed");
      const result = await response.json();
      onCalculate(result);
    } catch (error) {
      console.error("Error calculating cost:", error);
      if (error instanceof Error && error.name === "ZodError") {
        alert("Please fill in all required fields correctly.");
      } else {
        alert("Failed to calculate estimate. Please try again.");
      }
    }
  };

  const toggleAddon = (addon: Addon) => {
    const currentAddons = formData.addons || [];
    const newAddons = currentAddons.includes(addon)
      ? currentAddons.filter((a) => a !== addon)
      : [...currentAddons, addon];
    setFormData({ ...formData, addons: newAddons });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Project Estimator</CardTitle>
        <CardDescription>
          Fill in the details below to get an estimated cost for your website project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Website Type */}
          <div className="space-y-2">
            <Label htmlFor="websiteType">Website Type</Label>
            <Select
              value={formData.websiteType}
              onValueChange={(value) =>
                setFormData({ ...formData, websiteType: value as EstimatorFormData["websiteType"] })
              }
            >
              <SelectTrigger id="websiteType">
                <SelectValue placeholder="Select website type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portfolio">Portfolio</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="company">Company Website</SelectItem>
                <SelectItem value="custom">Custom System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Number of Pages */}
          <div className="space-y-2">
            <Label htmlFor="numberOfPages">Number of Pages</Label>
            <Input
              id="numberOfPages"
              type="number"
              min="1"
              value={formData.numberOfPages || 1}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  numberOfPages: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>

          {/* Complexity */}
          <div className="space-y-2">
            <Label htmlFor="complexity">Complexity</Label>
            <Select
              value={formData.complexity}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  complexity: value as EstimatorFormData["complexity"],
                })
              }
            >
              <SelectTrigger id="complexity">
                <SelectValue placeholder="Select complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add-ons */}
          <div className="space-y-3">
            <Label>Add-ons</Label>
            <div className="space-y-2">
              {(Object.keys(addonLabels) as Addon[]).map((addon) => (
                <div key={addon} className="flex items-center space-x-2">
                  <Checkbox
                    id={addon}
                    checked={formData.addons?.includes(addon)}
                    onCheckedChange={() => toggleAddon(addon)}
                  />
                  <Label
                    htmlFor={addon}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {addonLabels[addon]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Hosting */}
          <div className="space-y-2">
            <Label htmlFor="hosting">Hosting Options</Label>
            <Select
              value={formData.hosting}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  hosting: value as EstimatorFormData["hosting"],
                })
              }
            >
              <SelectTrigger id="hosting">
                <SelectValue placeholder="Select hosting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="shared">Shared Hosting</SelectItem>
                <SelectItem value="vps">VPS Hosting</SelectItem>
                <SelectItem value="cloud">Cloud Hosting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Domain */}
          <div className="space-y-2">
            <Label htmlFor="domain">Domain Options</Label>
            <Select
              value={formData.domain}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  domain: value as EstimatorFormData["domain"],
                })
              }
            >
              <SelectTrigger id="domain">
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="com">.com domain</SelectItem>
                <SelectItem value="ph">.ph domain</SelectItem>
                <SelectItem value="org">.org domain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Maintenance */}
          <div className="space-y-2">
            <Label htmlFor="maintenance">Maintenance Options</Label>
            <Select
              value={formData.maintenance}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  maintenance: value as EstimatorFormData["maintenance"],
                })
              }
            >
              <SelectTrigger id="maintenance">
                <SelectValue placeholder="Select maintenance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="monthly">Monthly Maintenance</SelectItem>
                <SelectItem value="yearly">Yearly Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <Label htmlFor="timeline">Timeline Urgency</Label>
            <Select
              value={formData.timeline}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  timeline: value as EstimatorFormData["timeline"],
                })
              }
            >
              <SelectTrigger id="timeline">
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flexible">Flexible (1x)</SelectItem>
                <SelectItem value="normal">Normal (1x)</SelectItem>
                <SelectItem value="rush">Rush</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Calculate Estimate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

