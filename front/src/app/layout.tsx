import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Amaly",
  description: "Outil de gestion pour associations et ONG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
