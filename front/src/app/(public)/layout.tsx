import { cn } from "@/lib/utils";

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
        {children}
      </body>
    </html>
  );
}
