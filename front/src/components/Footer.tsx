import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LucideFacebook, LucideInstagram, LucideTwitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-[322px] md:flex-row md:py-8">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2">
          <Link href="/">
            <Image
              src="/leaflogo.svg"
              alt="Amaly Logo"
              width={50}
              height={50}
            />
          </Link>
          <p className="text-center text-lg font-semibold md:text-left">
            Amaly
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="flex flex-col space-y-2 text-center md:text-left">
            <p className="font-semibold">Navigation</p>
            <Link href="/about" className="hover:underline">
              About Us
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
          <div className="flex flex-col space-y-2 text-center md:text-left">
            <p className="font-semibold">Ressources</p>
            <Link href="#" className="hover:underline">
              Blog
            </Link>
            <Link href="#" className="hover:underline">
              Guides
            </Link>
            <Link href="#" className="hover:underline">
              FAQ
            </Link>
          </div>
          <div className="flex flex-col space-y-2 text-center md:text-left">
            <p className="font-semibold">Suivez-nous</p>
            <div className="flex justify-center gap-4">
              <Link href="https://facebook.com" target="_blank">
                <LucideFacebook className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" target="_blank">
                <LucideTwitter className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" target="_blank">
                <LucideInstagram className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="py-4 text-center">
        <p>© {new Date().getFullYear()} Amaly. All Rights Reserved.</p>
      </div>
    </footer>
  );
};
