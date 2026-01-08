import "./globals.css";
import { Tangerine, Cormorant_Garamond } from "next/font/google";

const tangerine = Tangerine({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-title",
});

const bodyFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${tangerine.variable} ${bodyFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
