import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="flex justify-between items-center py-6">
      <div className="flex items-center space-x-2">
        <Link href="/">
          <Image src="/leaflogo.svg" alt="Logo Amaly" width={50} height={50} />
        </Link>
        <h1 className="text-primary text-3xl font-bold">Amaly</h1>
      </div>

      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/login" legacyBehavior>
              <Button variant="link">Se connecter</Button>
            </Link>
          </li>
          <li>
            <Link href="/signup" legacyBehavior>
              <Button variant="secondary">Essayer gratuitement</Button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
