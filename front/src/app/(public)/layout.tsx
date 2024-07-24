"use client";
import HeaderConnected from "@/components/layout/header/HeaderConnected";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user) {
    return (
      <>
        <HeaderConnected />
        <div>{children}</div>
        <Footer />
      </>
    );
  }
  return (
    <>
      <Header />
      <div>{children}</div>
      <Footer />
    </>
  );
}
