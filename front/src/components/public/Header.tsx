"use client";
import { selectIsAuthenticated } from "@/app/store/slices/authSlice";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import HeaderConnected from "../layout/header/HeaderConnected";

export const Header = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <>
      {isAuthenticated && <HeaderConnected />}
      {!isAuthenticated && (
        <header className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Image
                src="/leaflogo.svg"
                alt="Logo Amaly"
                width={50}
                height={50}
              />
            </Link>
            <h1 className="text-primary text-3xl font-bold">Amaly</h1>
          </div>

          <nav>
            <ul className="flex space-x-4 pr-4">
              <li>
                <Button variant="link" asChild>
                  <Link href="/login">Se connecter</Link>
                </Button>
              </li>
              <li>
                <Link href="/landing">
                  <Button variant="secondary">Organisation</Button>
                </Link>
              </li>
            </ul>
          </nav>
        </header>
      )}
    </>
  );
};
