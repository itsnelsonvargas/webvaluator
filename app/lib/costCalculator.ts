import type {
  EstimatorFormData,
  CostCalculationResult,
  CostBreakdown,
} from "./types";

function getEnvNumber(key: string, defaultValue: number = 0): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

export function calculateCost(data: EstimatorFormData): CostCalculationResult {
  // Base prices
  const basePrices: Record<EstimatorFormData["websiteType"], number> = {
    portfolio: getEnvNumber("BASE_PORTFOLIO_PRICE", 5000),
    blog: getEnvNumber("BASE_BLOG_PRICE", 6000),
    ecommerce: getEnvNumber("BASE_ECOMMERCE_PRICE", 12000),
    company: getEnvNumber("BASE_COMPANY_PRICE", 8000),
    custom: getEnvNumber("BASE_CUSTOM_PRICE", 15000),
  };

  const baseCost = basePrices[data.websiteType];

  // Complexity multipliers
  const complexityMultipliers: Record<EstimatorFormData["complexity"], number> =
    {
      basic: getEnvNumber("COMPLEXITY_BASIC", 1),
      standard: getEnvNumber("COMPLEXITY_STANDARD", 1.5),
      advanced: getEnvNumber("COMPLEXITY_ADVANCED", 2),
    };

  const complexityMultiplier = complexityMultipliers[data.complexity];

  // Add-ons
  const addonPrices: Record<string, number> = {
    pia: getEnvNumber("ADDON_PIA_PRICE", 1500),
    va: getEnvNumber("ADDON_VA_PRICE", 2000),
    uat: getEnvNumber("ADDON_UAT_PRICE", 2500),
    seo: getEnvNumber("ADDON_SEO_PRICE", 3000),
    adminDash: getEnvNumber("ADDON_ADMIN_DASH_PRICE", 5000),
    api: getEnvNumber("ADDON_API_PRICE", 5000),
    uiux: getEnvNumber("ADDON_UIUX_PRICE", 4000),
  };

  const addons: Record<string, number> = {};
  let addonsTotal = 0;

  for (const addon of data.addons) {
    const price = addonPrices[addon] || 0;
    addons[addon] = price;
    addonsTotal += price;
  }

  // Hosting
  const hostingPrices: Record<EstimatorFormData["hosting"], number> = {
    shared: getEnvNumber("ADDON_HOSTING_SHARED", 2000),
    vps: getEnvNumber("ADDON_HOSTING_VPS", 4500),
    cloud: getEnvNumber("ADDON_HOSTING_CLOUD", 8000),
    none: 0,
  };

  const hosting = hostingPrices[data.hosting];

  // Domain
  const domainPrices: Record<EstimatorFormData["domain"], number> = {
    com: getEnvNumber("ADDON_DOMAIN_COM", 800),
    ph: getEnvNumber("ADDON_DOMAIN_PH", 1500),
    org: getEnvNumber("ADDON_DOMAIN_ORG", 1000),
    none: 0,
  };

  const domain = domainPrices[data.domain];

  // Maintenance
  const maintenancePrices: Record<EstimatorFormData["maintenance"], number> = {
    monthly: getEnvNumber("MAINTENANCE_MONTHLY", 1500),
    yearly: getEnvNumber("MAINTENANCE_YEARLY", 10000),
    none: 0,
  };

  const maintenance = maintenancePrices[data.maintenance];

  // Timeline multiplier
  const timelineMultipliers: Record<EstimatorFormData["timeline"], number> = {
    flexible: 1,
    normal: 1,
    rush: getEnvNumber("RUSH_MULTIPLIER", 1.5),
  };

  const timelineMultiplier = timelineMultipliers[data.timeline];

  // Calculate total
  const subtotal =
    baseCost * complexityMultiplier + addonsTotal + hosting + domain + maintenance;
  const total = subtotal * timelineMultiplier;

  const breakdown: CostBreakdown = {
    baseCost,
    complexityMultiplier,
    addons,
    ...(hosting > 0 && { hosting }),
    ...(domain > 0 && { domain }),
    ...(maintenance > 0 && { maintenance }),
    timelineMultiplier,
  };

  return {
    total: Math.round(total),
    breakdown,
  };
}

