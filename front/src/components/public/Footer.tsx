import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LucideFacebook, LucideInstagram, LucideTwitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Image
                src="/leaflogo.svg"
                alt="Amaly Logo"
                width={50}
                height={50}
              />
            </Link>
            <h1 className="text-3xl font-bold">Amaly</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h2 className="font-semibold mb-2">Navigation</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-semibold mb-2">Resources</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:underline">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-semibold mb-2">Follow Us</h2>
              <div className="flex justify-center md:justify-start space-x-4">
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  className="hover:text-[hsl(var(--secondary))]"
                >
                  <LucideFacebook className="h-6 w-6" />
                </Link>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  className="hover:text-[hsl(var(--secondary))]"
                >
                  <LucideTwitter className="h-6 w-6" />
                </Link>
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  className="hover:text-[hsl(var(--secondary))]"
                >
                  <LucideInstagram className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[hsl(var(--primary-foreground))] opacity-20 mt-8"></div>
      <div className="container mx-auto px-4 py-4 text-center">
        <p>© {new Date().getFullYear()} Amaly. All Rights Reserved.</p>
      </div>
    </footer>
  );
};
