import { cn } from "@/lib/utils";
import "./globals.css";
import { Providers } from "@/components/layout/providers";

export const metadata = {
  title: "Amaly",
  description: "Tool for non-profit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
