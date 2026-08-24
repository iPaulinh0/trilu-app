import type { Metadata, Viewport } from "next";
import { nunitoSans, sora } from "@/lib/fonts";
import { Toaster } from "@/components/ui/sonner";
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
    <html lang="pt-BR" className={`${nunitoSans.variable} ${sora.variable} h-full antialiased`}>
      <body className="min-h-svh">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
