import localFont from "next/font/local";

/**
 * Nunito Sans — interface, body text, and numeric/metric values.
 * Files copied from design-bundle/assets/fonts (brand kit source).
 */
export const nunitoSans = localFont({
  variable: "--font-nunito-sans",
  display: "swap",
  src: [
    { path: "../assets/fonts/nunito-sans-400.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/nunito-sans-600.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/nunito-sans-700.woff2", weight: "700", style: "normal" },
    { path: "../assets/fonts/nunito-sans-800.woff2", weight: "800", style: "normal" },
  ],
});

/**
 * Sora — headlines and celebration messages.
 */
export const sora = localFont({
  variable: "--font-sora",
  display: "swap",
  src: [
    { path: "../assets/fonts/sora-400.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/sora-600.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/sora-700.woff2", weight: "700", style: "normal" },
  ],
});
