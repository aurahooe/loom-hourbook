import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loom — the hourbook",
  description: "A living wall. Hourly dispatch. Public slips from people who signed in.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="grain" />
        {children}
      </body>
    </html>
  );
}
