import jsPDF from "jspdf";
import { Report, Analysis } from "./supabase";

export function generateReportPDF(report: Report, userEmail: string) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Color definitions (RGB)
  const colors = {
    normal: [34, 197, 94],      // Green
    warning: [234, 179, 8],      // Yellow/Amber
    concerning: [239, 68, 68],   // Red
    text: [30, 30, 30],
    muted: [120, 120, 120],
    border: [200, 200, 200],
    lightGray: [245, 245, 245],
  };

  // Helper functions
  const addText = (text: string, x: number, y: number, opts?: any) => {
    doc.text(text, x, y, opts);
  };

  const addLine = (y: number, color = colors.border, width = 0.5) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(width);
    doc.line(margin, y, pageWidth - margin, y);
  };

  const addColoredBadge = (text: string, x: number, y: number, bgColor: number[], textColor = [255, 255, 255]) => {
    doc.setFillColor(...bgColor);
    doc.rect(x - 8, y - 3, 16, 5, "F");
    doc.setTextColor(...textColor);
    doc.setFontSize(8);
    doc.setFont("", "bold");
    doc.text(text.toUpperCase(), x, y, { align: "center" });
    doc.setTextColor(...colors.text);
    doc.setFont("", "normal");
  };

  const checkPageBreak = (spaceNeeded: number) => {
    if (yPosition + spaceNeeded > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  const analysis = report.analysis;
  const userName = userEmail.split("@")[0];
  const reportDate = new Date(report.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ========== HEADER ==========
  doc.setTextColor(...colors.text);
  doc.setFont("", "bold");
  doc.setFontSize(18);
  addText("labread.health", margin, yPosition);
  yPosition += 7;

  doc.setFontSize(14);
  addText("BLOOD TEST REPORT", margin, yPosition);
  yPosition += 6;

  doc.setFont("", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...colors.muted);
  addText(`Generated on ${reportDate}`, margin, yPosition);
  yPosition += 10;

  addLine(yPosition, colors.text, 0.8);
  yPosition += 8;

  // ========== PATIENT INFORMATION ==========
  doc.setTextColor(...colors.text);
  doc.setFont("", "bold");
  doc.setFontSize(11);
  addText("PATIENT INFORMATION", margin, yPosition);
  yPosition += 6;

  doc.setFont("", "normal");
  doc.setFontSize(10);
  addText(`Name: ${userName}`, margin, yPosition);
  yPosition += 5;
  addText(`Report Type: ${analysis.title}`, margin, yPosition);
  yPosition += 5;
  addText(`Date: ${reportDate}`, margin, yPosition);
  yPosition += 9;

  // ========== SUMMARY STATISTICS ==========
  checkPageBreak(35);
  doc.setFont("", "bold");
  doc.setFontSize(11);
  addText("SUMMARY", margin, yPosition);
  yPosition += 7;

  const normalCount = analysis.values.filter((v) => v.status === "normal").length;
  const abnormalCount = analysis.values.filter(
    (v) => v.status === "low" || v.status === "high"
  ).length;
  const concerningCount = analysis.values.filter(
    (v) => v.status === "elevated" || v.status === "deficient"
  ).length;

  // Three summary boxes
  const boxWidth = (contentWidth - 4) / 3;
  const boxHeight = 16;
  const boxY = yPosition;

  // Normal box (Green)
  doc.setFillColor(...colors.normal);
  doc.rect(margin, boxY, boxWidth, boxHeight, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("", "bold");
  doc.setFontSize(14);
  addText(String(normalCount), margin + boxWidth / 2, boxY + 6, { align: "center" });
  doc.setFontSize(8);
  addText("Normal", margin + boxWidth / 2, boxY + 11, { align: "center" });

  // Abnormal box (Yellow)
  doc.setFillColor(...colors.warning);
  doc.rect(margin + boxWidth + 2, boxY, boxWidth, boxHeight, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("", "bold");
  doc.setFontSize(14);
  addText(String(abnormalCount), margin + boxWidth * 1.5 + 2, boxY + 6, { align: "center" });
  doc.setFontSize(8);
  addText("Off-Range", margin + boxWidth * 1.5 + 2, boxY + 11, { align: "center" });

  // Concerning box (Red)
  doc.setFillColor(...colors.concerning);
  doc.rect(margin + boxWidth * 2 + 4, boxY, boxWidth, boxHeight, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("", "bold");
  doc.setFontSize(14);
  addText(String(concerningCount), margin + boxWidth * 2.5 + 4, boxY + 6, { align: "center" });
  doc.setFontSize(8);
  addText("Concerning", margin + boxWidth * 2.5 + 4, boxY + 11, { align: "center" });

  yPosition += boxHeight + 8;
  doc.setTextColor(...colors.text);

  // ========== BLOOD VALUES TABLE ==========
  checkPageBreak(30);
  doc.setFont("", "bold");
  doc.setFontSize(11);
  addText("BLOOD VALUES", margin, yPosition);
  yPosition += 7;

  // Table headers
  const tableStartY = yPosition;
  const colWidths = [70, 25, 30, 30];
  const colX = [margin, margin + 70, margin + 95, margin + 125];
  const rowHeight = 6;

  // Header background
  doc.setFillColor(50, 50, 50);
  doc.rect(margin, tableStartY - 3, contentWidth, rowHeight + 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("", "bold");
  doc.setFontSize(9);
  addText("Test Name", colX[0] + 1, tableStartY + 1);
  addText("Value", colX[1] + 1, tableStartY + 1);
  addText("Status", colX[2] + 1, tableStartY + 1);

  yPosition += rowHeight + 2;
  doc.setTextColor(...colors.text);
  doc.setFont("", "normal");
  doc.setFontSize(9);

  // Table rows
  let rowCount = 0;
  analysis.values.forEach((value) => {
    checkPageBreak(8);

    // Alternate row background
    if (rowCount % 2 === 1) {
      doc.setFillColor(...colors.lightGray);
      doc.rect(margin, yPosition - 3, contentWidth, rowHeight + 2, "F");
    }

    // Determine status badge color
    let badgeColor = colors.normal;
    let badgeLabel = "Normal";
    if (value.status === "low" || value.status === "high") {
      badgeColor = colors.warning;
      badgeLabel = value.status === "low" ? "Low" : "High";
    } else if (value.status === "elevated" || value.status === "deficient") {
      badgeColor = colors.concerning;
      badgeLabel = value.status === "elevated" ? "Elevated" : "Deficient";
    }

    // Name
    doc.setFont("", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.text);
    const nameTruncated = value.name.length > 30 ? value.name.substring(0, 27) + "..." : value.name;
    addText(nameTruncated, colX[0] + 1, yPosition + 1);

    // Value
    addText(value.value, colX[1] + 1, yPosition + 1);

    // Status badge
    addColoredBadge(badgeLabel, colX[2] + 13, yPosition + 1, badgeColor);

    yPosition += rowHeight + 2;
    rowCount++;
  });

  yPosition += 4;

  // ========== DETAILED EXPLANATIONS ==========
  checkPageBreak(25);
  doc.setFont("", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...colors.text);
  addText("DETAILED ANALYSIS", margin, yPosition);
  yPosition += 7;

  analysis.values.forEach((value) => {
    checkPageBreak(12);

    // Value name in bold with accent color
    doc.setFont("", "bold");
    doc.setFontSize(10);
    doc.setTextColor(100, 150, 255);
    addText(value.name, margin, yPosition);
    yPosition += 4;

    // Explanation text
    doc.setFont("", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.text);
    const explanationLines = doc.splitTextToSize(value.explanation, contentWidth - 4);
    explanationLines.forEach((line: string) => {
      checkPageBreak(4);
      addText(line, margin + 2, yPosition);
      yPosition += 3.5;
    });

    yPosition += 2;
  });

  // ========== RECOMMENDED SCREENINGS ==========
  if (analysis.screenings.length > 0) {
    checkPageBreak(20);
    doc.setFont("", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...colors.text);
    addText("RECOMMENDED SCREENINGS", margin, yPosition);
    yPosition += 7;

    analysis.screenings.forEach((screening) => {
      checkPageBreak(10);

      // Determine urgency color
      let urgencyColor = colors.warning;
      if (screening.urgency === "urgent") {
        urgencyColor = colors.concerning;
      } else if (screening.urgency === "informational") {
        urgencyColor = [100, 150, 255];
      }

      // Screening name
      doc.setFont("", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...urgencyColor);
      addText(`• ${screening.name}`, margin, yPosition);
      yPosition += 4;

      // Urgency badge and detail
      doc.setFont("", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...colors.muted);
      const urgencyLabel = screening.urgency.charAt(0).toUpperCase() + screening.urgency.slice(1);
      addText(`[${urgencyLabel}]`, margin + 2, yPosition);

      doc.setTextColor(...colors.text);
      const detailText = screening.detail;
      const detailLines = doc.splitTextToSize(detailText, contentWidth - 6);
      detailLines.forEach((line: string, idx: number) => {
        if (idx === 0) {
          addText(line, margin + 20, yPosition);
        } else {
          yPosition += 3;
          checkPageBreak(4);
          addText(line, margin + 4, yPosition);
        }
      });

      yPosition += 4;
    });
  }

  // ========== FOOTER / DISCLAIMER ==========
  checkPageBreak(15);
  yPosition += 4;
  addLine(yPosition, colors.border, 0.5);
  yPosition += 4;

  doc.setFont("", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...colors.muted);
  const disclaimerText = "DISCLAIMER: This is an AI-generated explanation of your blood test results and is not medical advice. It should not be used as a substitute for professional medical consultation. Always discuss your results with a qualified healthcare provider before making any health decisions. If you have concerns about your results, contact your doctor immediately.";
  const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth);
  disclaimerLines.forEach((line: string) => {
    addText(line, margin, yPosition);
    yPosition += 3;
  });

  // ========== SAVE ==========
  const fileName = `labread_${analysis.title.toLowerCase().replace(/\s+/g, "_")}_${new Date(report.created_at).getFullYear()}-${String(new Date(report.created_at).getMonth() + 1).padStart(2, "0")}-${String(new Date(report.created_at).getDate()).padStart(2, "0")}.pdf`;
  doc.save(fileName);
}
