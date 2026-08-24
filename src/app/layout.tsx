import type { Metadata, Viewport } from "next";
import { nunitoSans, sora } from "@/lib/fonts";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/shared/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trilu",
  description: "Seu objetivo vira caminho.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunitoSans.variable} ${sora.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-svh">
        <ThemeProvider>
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
