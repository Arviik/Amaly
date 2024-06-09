import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui//label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center bg-background p-8 lg:p-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold">Se connecter</span>
                </div>
                <Link href="/" className="text-muted-accent hover:underline">
                  Retour à l&apos;accueil
                </Link>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
              <Button variant="outline" className="w-full">
                Se connecter avec Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link href="/signup" className="underline">
                S&apos;inscrire
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/picture.PNG"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
