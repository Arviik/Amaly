import Link from "next/link";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="flex justify-between items-center py-6">
      <h1 className="text-3xl font-bold text-primary">Amaly</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/auth/login" legacyBehavior>
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
