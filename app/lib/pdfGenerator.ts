import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { CostCalculationResult } from './types';

export async function generateCostSummaryPDF(result: CostCalculationResult): Promise<void> {
  try {
    // Get the current website URL (works for both local and production)
    const websiteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://webvaluator.com';

    // Create a new jsPDF instance
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Professional color scheme
    const primaryBlue = '#1e40af';    // Professional blue
    const lightBlue = '#eff6ff';     // Light blue background
    const darkGray = '#1f2937';      // Dark gray for text
    const mediumGray = '#6b7280';    // Medium gray
    const lightGray = '#f9fafb';     // Light gray background

    // Function to format currency with peso sign
    const formatCurrency = (amount: number) => {
      return `Php ${amount.toLocaleString('en-PH')}`;
    };

    // Header Section
    let yPosition = 25;

    // Main title
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(primaryBlue);
    pdf.text('Website Development Cost Summary', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 15;

    // Prepared by
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(darkGray);
    pdf.text('Prepared by: Professional Analysis Group', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 10;

    // Date generated
    pdf.setFontSize(11);
    pdf.setTextColor(mediumGray);
    pdf.text(`Date Generated: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, pageWidth / 2, yPosition, { align: 'center' });

    // Decorative line
    yPosition += 15;
    pdf.setDrawColor(primaryBlue);
    pdf.setLineWidth(1);
    pdf.line(30, yPosition, pageWidth - 30, yPosition);

    // Main Content Header
    yPosition += 20;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(darkGray);
    pdf.text('Estimated Investment Overview', pageWidth / 2, yPosition, { align: 'center' });

    // Use the actual cost breakdown from the calculator result
    const breakdown = result.breakdown;

    // Table Header
    yPosition += 20;
    const tableStartY = yPosition;
    const col1X = 30;
    const col2X = 130;
    const rowHeight = 12;

    // Table header background
    pdf.setFillColor(lightGray);
    pdf.rect(col1X - 5, yPosition - 5, pageWidth - 60, rowHeight, 'F');

    // Table headers
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(darkGray);
    pdf.text('Category', col1X, yPosition + 3);
    pdf.text('Estimated Cost', col2X, yPosition + 3);

    // Table content
    yPosition += rowHeight;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    const addTableRow = (category: string, cost: number, isBold = false, isTotal = false) => {
      if (isTotal) {
        pdf.setFillColor(lightBlue);
        pdf.rect(col1X - 5, yPosition - 3, pageWidth - 60, rowHeight, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(primaryBlue);
      } else if (isBold) {
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(darkGray);
      } else {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(darkGray);
      }

      pdf.text(category, col1X, yPosition + 3);
      pdf.text(formatCurrency(cost), col2X, yPosition + 3);

      // Table lines
      pdf.setDrawColor('#e5e7eb');
      pdf.setLineWidth(0.3);
      pdf.line(col1X - 5, yPosition + rowHeight - 3, pageWidth - 25, yPosition + rowHeight - 3);

      yPosition += rowHeight;
    };

    // Add table rows based on actual cost breakdown from calculator
    // Base Cost
    addTableRow('Base Cost', breakdown.baseCost);

    // Complexity Multiplier (only show if > 1)
    if (breakdown.complexityMultiplier > 1) {
      const complexityCost = breakdown.baseCost * (breakdown.complexityMultiplier - 1);
      addTableRow(`Complexity Multiplier (${breakdown.complexityMultiplier}x)`, complexityCost);
    }

    // Add-ons (individual items)
    const addonLabels: Record<string, string> = {
      pia: "Project Initial Analysis (PIA)",
      va: "Virtual Assistant (VA)",
      uat: "User Acceptance Testing (UAT)",
      seo: "SEO Setup",
      adminDash: "Admin Dashboard",
      api: "API Integration",
      uiux: "UI/UX Designer Included",
    };

    Object.entries(breakdown.addons).forEach(([addonKey, cost]) => {
      const label = addonLabels[addonKey] || addonKey;
      addTableRow(label, cost);
    });

    // Hosting (if selected)
    if (breakdown.hosting) {
      addTableRow('Hosting', breakdown.hosting);
    }

    // Domain (if selected)
    if (breakdown.domain) {
      addTableRow('Domain', breakdown.domain);
    }

    // Maintenance (if selected)
    if (breakdown.maintenance) {
      addTableRow('Maintenance', breakdown.maintenance);
    }

    // Timeline Multiplier (only show if > 1)
    if (breakdown.timelineMultiplier > 1) {
      const subtotalBeforeTimeline = result.total / breakdown.timelineMultiplier;
      const timelineCost = result.total - subtotalBeforeTimeline;
      addTableRow(`Timeline Multiplier (${breakdown.timelineMultiplier}x)`, timelineCost);
    }

    // Total
    addTableRow('TOTAL ESTIMATED COST', result.total, true, true);

    // Important Notes Section
    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(primaryBlue);
    pdf.text('Important Notes / Disclaimer', 30, yPosition);

    yPosition += 10;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(darkGray);

    const disclaimer1 = 'This is an estimate. Final costs may vary based on detailed scope and requirements.';
    const disclaimer2 = 'Costs for third-party services (e.g., domain, premium hosting) are not included.';

    pdf.text(disclaimer1, 30, yPosition);
    yPosition += 6;
    pdf.text(disclaimer2, 30, yPosition);

    // Contact Information Section
    yPosition += 20;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(primaryBlue);
    pdf.text('Contact Information', 30, yPosition);

    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(darkGray);

    pdf.text('Direct Contact Email:', 30, yPosition);
    pdf.setTextColor(primaryBlue);
    pdf.textWithLink('itsnelsonvargas@gmail.com', 80, yPosition, {
      url: 'mailto:itsnelsonvargas@gmail.com'
    });

    yPosition += 8;
    pdf.setTextColor(darkGray);
    pdf.text('Website:', 30, yPosition);
    pdf.setTextColor(primaryBlue);
    const displayUrl = websiteUrl.replace(/^https?:\/\//, '');
    pdf.textWithLink(displayUrl, 50, yPosition, {
      url: websiteUrl
    });

    // Save the PDF
    const dateStr = new Date().toISOString().split('T')[0];
    pdf.save(`Website-Development-Cost-Summary-${dateStr}.pdf`);
  } catch (error) {
    console.error('Error generating cost summary PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
}

export async function generateEstimatePDF(result: CostCalculationResult): Promise<void> {
  try {
    // Get the current website URL (works for both local and production)
    const websiteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://webvaluator.com';

    // Create a new jsPDF instance
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Professional color scheme
    const primaryColor = '#1f2937';    // Dark gray
    const secondaryColor = '#6b7280';  // Medium gray
    const accentColor = '#3b82f6';     // Blue accent
    const lightAccent = '#eff6ff';     // Light blue background
    const borderColor = '#e5e7eb';     // Light border
    const textColor = '#374151';       // Text color

    // Header Section with Professional Branding
    // Header background with gradient effect
    pdf.setFillColor(248, 250, 252); // Light gray background
    pdf.rect(0, 0, pageWidth, 60, 'F');

    // Accent top border
    pdf.setFillColor(accentColor);
    pdf.rect(0, 0, pageWidth, 3, 'F');

    // Company branding
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(primaryColor);
    pdf.text('WebValuator', 20, 20);

    // Tagline
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(secondaryColor);
    pdf.text('Professional Website Cost Estimation & Development Services', 20, 32);

    // Contact information in header
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(textColor);
    pdf.text('Email: itsnelsonvargas@gmail.com', 20, 42);

    // Website link (right aligned in header)
    pdf.setFontSize(10);
    pdf.setTextColor(accentColor);
    const displayUrl = websiteUrl.replace(/^https?:\/\//, ''); // Remove protocol for display
    pdf.text(displayUrl, pageWidth - 20, 42, { align: 'right' });

    // Decorative line
    pdf.setDrawColor(accentColor);
    pdf.setLineWidth(0.8);
    pdf.line(20, 55, pageWidth - 20, 55);

    // Decorative line
    pdf.setDrawColor(accentColor);
    pdf.setLineWidth(1);
    pdf.line(20, 45, pageWidth - 20, 45);

    // Estimate title and date
    let yPosition = 70;
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(primaryColor);
    pdf.text('WEBSITE COST ESTIMATE', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 10;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(secondaryColor);
    pdf.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, pageWidth / 2, yPosition, { align: 'center' });

    // Cost Breakdown Section
    yPosition += 25;

    // Professional estimate badge
    pdf.setFillColor(accentColor);
    pdf.rect(15, yPosition - 8, 85, 15, 'F');
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('PROFESSIONAL ESTIMATE', 20, yPosition + 2);

    // Validity period
    pdf.setFontSize(8);
    pdf.setTextColor(secondaryColor);
    const validityDate = new Date();
    validityDate.setDate(validityDate.getDate() + 30);
    pdf.text(`Valid until: ${validityDate.toLocaleDateString()}`, pageWidth - 20, yPosition + 2, { align: 'right' });

    yPosition += 20;

    // Section header with background
    pdf.setFillColor(249, 250, 251);
    pdf.rect(15, yPosition - 8, pageWidth - 30, 15, 'F');

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(primaryColor);
    pdf.text('DETAILED COST BREAKDOWN', 20, yPosition + 2);
    yPosition += 20;

    // Function to format currency with peso sign
    const formatCurrency = (amount: number) => {
      return `Php ${amount.toLocaleString('en-PH')}`;
    };

    // Function to add a professional line item
    const addLineItem = (label: string, value: string, isTotal = false, isSubtotal = false) => {
      const lineHeight = isTotal ? 12 : 10;
      const fontSize = isTotal ? 13 : 11;
      const fontWeight = isTotal || isSubtotal ? 'bold' : 'normal';
      const textColor = isTotal ? primaryColor : isSubtotal ? textColor : secondaryColor;

      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontWeight);
      pdf.setTextColor(textColor);

      // Draw label
      pdf.text(label, 25, yPosition);

      // Draw value (right aligned)
      pdf.text(value, pageWidth - 25, yPosition);

      // Draw subtle line for separation (except for total)
      if (!isTotal && !isSubtotal) {
        pdf.setDrawColor(240, 240, 240);
        pdf.setLineWidth(0.2);
        pdf.line(25, yPosition + 2, pageWidth - 25, yPosition + 2);
      }

      yPosition += lineHeight;
    };

    // Function to add section with background
    const addSection = (title: string) => {
      yPosition += 5;
      pdf.setFillColor(249, 250, 251);
      pdf.rect(15, yPosition - 5, pageWidth - 30, 12, 'F');

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(primaryColor);
      pdf.text(title, 20, yPosition + 2);
      yPosition += 15;
    };

    // Base Project Cost
    addSection('PROJECT COSTS');
    addLineItem('Base Website Cost', formatCurrency(result.breakdown.baseCost));

    // Complexity Multiplier
    if (result.breakdown.complexityMultiplier !== 1) {
      const complexityAmount = result.breakdown.baseCost * result.breakdown.complexityMultiplier - result.breakdown.baseCost;
      addLineItem(
        `Complexity Adjustment (${result.breakdown.complexityMultiplier}x)`,
        formatCurrency(complexityAmount)
      );
    }

    // Add-ons
    if (Object.keys(result.breakdown.addons).length > 0) {
      addSection('PROFESSIONAL SERVICES');
      const addonLabels: Record<string, string> = {
        pia: "Project Initial Analysis (PIA)",
        va: "Virtual Assistant (VA)",
        uat: "User Acceptance Testing (UAT)",
        seo: "SEO Setup & Optimization",
        adminDash: "Admin Dashboard Development",
        api: "API Integration & Development",
        uiux: "UI/UX Design Services",
      };

      Object.entries(result.breakdown.addons).forEach(([addon, price]) => {
        addLineItem(
          addonLabels[addon] || addon,
          formatCurrency(price)
        );
      });
    }

    // Additional Services
    if (result.breakdown.hosting || result.breakdown.domain || result.breakdown.maintenance) {
      addSection('ADDITIONAL SERVICES');
    }

    // Hosting
    if (result.breakdown.hosting) {
      addLineItem('Web Hosting Setup', formatCurrency(result.breakdown.hosting));
    }

    // Domain
    if (result.breakdown.domain) {
      addLineItem('Domain Registration', formatCurrency(result.breakdown.domain));
    }

    // Maintenance
    if (result.breakdown.maintenance) {
      addLineItem('Website Maintenance', formatCurrency(result.breakdown.maintenance));
    }

    // Timeline Multiplier
    if (result.breakdown.timelineMultiplier !== 1) {
      addSection('PROJECT TIMELINE');
      const subtotal =
        result.breakdown.baseCost * result.breakdown.complexityMultiplier +
        Object.values(result.breakdown.addons).reduce((sum, price) => sum + price, 0) +
        (result.breakdown.hosting || 0) +
        (result.breakdown.domain || 0) +
        (result.breakdown.maintenance || 0);

      const timelineAmount = subtotal * result.breakdown.timelineMultiplier - subtotal;
      addLineItem(
        `Rush Timeline Adjustment (${result.breakdown.timelineMultiplier}x)`,
        formatCurrency(timelineAmount)
      );
    }

    // Total Estimate with professional styling
    yPosition += 15;

    // Total background
    pdf.setFillColor(accentColor);
    pdf.rect(15, yPosition - 5, pageWidth - 30, 20, 'F');

    pdf.setTextColor(255, 255, 255); // White text
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TOTAL PROJECT COST', 25, yPosition + 8);

    pdf.setFontSize(16);
    pdf.text(formatCurrency(result.total), pageWidth - 25, yPosition + 8, { align: 'right' });

    yPosition += 30;

    // Sidebar with Website Link and Quick Actions
    const sidebarWidth = 60;
    const sidebarX = pageWidth - sidebarWidth;

    // Sidebar background
    pdf.setFillColor(lightAccent);
    pdf.rect(sidebarX, 50, sidebarWidth, pageHeight - 100, 'F');

    // Sidebar border
    pdf.setDrawColor(accentColor);
    pdf.setLineWidth(0.3);
    pdf.line(sidebarX, 50, sidebarX, pageHeight - 50);

    // Sidebar title
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(primaryColor);
    pdf.text('CONTACT', sidebarX + sidebarWidth/2, 65, { align: 'center' });
    pdf.text('& LINKS', sidebarX + sidebarWidth/2, 72, { align: 'center' });

    // Contact info in sidebar
    let sidebarY = 85;
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(textColor);
    pdf.text('EMAIL:', sidebarX + sidebarWidth/2, sidebarY, { align: 'center' });
    sidebarY += 5;

    pdf.setFontSize(5);
    pdf.setTextColor(accentColor);
    pdf.textWithLink('itsnelsonvargas', sidebarX + sidebarWidth/2, sidebarY, {
      url: 'mailto:itsnelsonvargas@gmail.com',
      align: 'center'
    });
    sidebarY += 4;
    pdf.text('@gmail.com', sidebarX + sidebarWidth/2, sidebarY, { align: 'center' });

    // Website link in sidebar
    sidebarY += 10;
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(accentColor);
    pdf.text('VISIT', sidebarX + sidebarWidth/2, sidebarY, { align: 'center' });
    sidebarY += 5;

    pdf.setFontSize(5);
    pdf.textWithLink('WebValuator', sidebarX + sidebarWidth/2, sidebarY, {
      url: websiteUrl,
      align: 'center'
    });
    sidebarY += 6;

    pdf.setFontSize(4);
    pdf.setTextColor(secondaryColor);
    pdf.text('Get New', sidebarX + sidebarWidth/2, sidebarY, { align: 'center' });
    sidebarY += 3;
    pdf.text('Estimate', sidebarX + sidebarWidth/2, sidebarY, { align: 'center' });

    // Decorative element
    pdf.setDrawColor(accentColor);
    pdf.setLineWidth(0.5);
    pdf.line(sidebarX + 5, sidebarY + 10, sidebarX + sidebarWidth - 5, sidebarY + 10);

    // Additional info
    sidebarY += 20;
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(textColor);
    pdf.text('Share', sidebarX + sidebarWidth/2, sidebarY, { align: 'center' });
    sidebarY += 5;
    pdf.text('Print', sidebarX + sidebarWidth/2, sidebarY, { align: 'center' });
    sidebarY += 5;
    pdf.text('Save', sidebarX + sidebarWidth/2, sidebarY, { align: 'center' });

    // Professional Footer and Contact Information
    const footerY = pageHeight - 50;

    // Footer background
    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, footerY - 10, pageWidth - sidebarWidth, 50, 'F'); // Leave space for sidebar

    // Decorative top line
    pdf.setDrawColor(accentColor);
    pdf.setLineWidth(0.5);
    pdf.line(0, footerY - 10, pageWidth - sidebarWidth, footerY - 10);

    // Company information
    const footerCenterX = (pageWidth - sidebarWidth) / 2;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(primaryColor);
    pdf.text('WebValuator', footerCenterX, footerY, { align: 'center' });

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(secondaryColor);
    pdf.text('Professional Website Development & Digital Solutions', footerCenterX, footerY + 8, { align: 'center' });

    // Contact details
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(textColor);
    pdf.text('Contact: itsnelsonvargas@gmail.com', footerCenterX, footerY + 18, { align: 'center' });

    // Website link
    pdf.setTextColor(accentColor);
    pdf.setFont('helvetica', 'normal');
    const visitText = `Website: ${displayUrl}`;
    pdf.textWithLink(visitText, footerCenterX, footerY + 26, {
      url: websiteUrl,
      align: 'center'
    });

    // Professional disclaimer
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(secondaryColor);
    pdf.text('For detailed project discussions or custom requirements, please reach out via email above.', footerCenterX, footerY + 33, { align: 'center' });

    // Professional terms and validity
    pdf.setFontSize(6);
    pdf.setTextColor('#6b7280');
    const termsText = 'This professional estimate is valid for 30 days. Final pricing may be adjusted based on specific project requirements, scope changes, or additional features.';
    const maxWidth = pageWidth - sidebarWidth - 40; // Account for margins
    const termsLines = pdf.splitTextToSize(termsText, maxWidth);
    pdf.text(termsLines, footerCenterX, footerY + 39, { align: 'center' });

    // Bottom branding with professional seal
    pdf.setFontSize(6);
    pdf.setTextColor('#9ca3af');
    pdf.text('© 2025 WebValuator Professional Services | Estimate ID: WV-' + Date.now().toString().slice(-6), footerCenterX, footerY + 48, { align: 'center' });

    // Save the PDF
    const dateStr = new Date().toISOString().split('T')[0];
    pdf.save(`WebValuator-Estimate-${dateStr}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
}
