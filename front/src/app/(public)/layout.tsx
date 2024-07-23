import { Header } from "@/components/public/Header";

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
    <>
      <Header />
      <div>{children}</div>
    </>
  );
}
