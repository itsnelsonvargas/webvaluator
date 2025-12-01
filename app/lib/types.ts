import { z } from "zod";

export const websiteTypeSchema = z.enum([
  "portfolio",
  "blog",
  "ecommerce",
  "company",
  "custom",
]);

export const complexitySchema = z.enum(["basic", "standard", "advanced"]);

export const hostingSchema = z.enum(["shared", "vps", "cloud", "none"]);

export const domainSchema = z.enum(["com", "ph", "org", "none"]);

export const maintenanceSchema = z.enum(["monthly", "yearly", "none"]);

export const timelineSchema = z.enum(["flexible", "normal", "rush"]);

export const addonSchema = z.enum([
  "pia",
  "va",
  "uat",
  "seo",
  "adminDash",
  "api",
  "uiux",
]);

export const estimatorFormSchema = z.object({
  websiteType: websiteTypeSchema,
  numberOfPages: z.number().min(1, "Number of pages must be at least 1"),
  complexity: complexitySchema,
  addons: z.array(addonSchema),
  hosting: hostingSchema,
  domain: domainSchema,
  maintenance: maintenanceSchema,
  timeline: timelineSchema,
});

export type WebsiteType = z.infer<typeof websiteTypeSchema>;
export type Complexity = z.infer<typeof complexitySchema>;
export type Hosting = z.infer<typeof hostingSchema>;
export type Domain = z.infer<typeof domainSchema>;
export type Maintenance = z.infer<typeof maintenanceSchema>;
export type Timeline = z.infer<typeof timelineSchema>;
export type Addon = z.infer<typeof addonSchema>;
export type EstimatorFormData = z.infer<typeof estimatorFormSchema>;

export interface CostBreakdown {
  baseCost: number;
  complexityMultiplier: number;
  addons: Record<string, number>;
  hosting?: number;
  domain?: number;
  maintenance?: number;
  timelineMultiplier: number;
}

export interface CostCalculationResult {
  total: number;
  breakdown: CostBreakdown;
}

