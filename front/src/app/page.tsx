import { Currency, Handshake, Heading, LucideFile, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Link from "next/link";
import { Header } from "@/components/Header";

export default function RootPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <section className="text-center py-12">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
          Simplifiez la gestion de votre association avec{" "}
          <span className="text-primary">Amaly</span>
        </h2>
        <p className="max-w-3xl mx-auto mt-4 text-lg sm:text-xl text-muted-foreground">
          Une solution tout-en-un pour gérer vos membres, vos dons, vos
          assemblées générales et vos documents importants.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/auth/login" legacyBehavior>
            <Button size="lg">Se connecter</Button>
          </Link>
          <Link href="/signup" legacyBehavior>
            <Button variant="secondary" size="lg">
              Essayer gratuitement
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Fonctionnalités clés
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-zinc-200 p-6 text-center">
            <CardContent>
              <User className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">
                Gestion des membres
              </h3>
              <p className="text-muted-foreground">
                Gérez facilement les adhésions, les statuts et les informations
                de vos membres.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-200 p-6 text-center">
            <CardContent>
              <Currency className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Gestion des dons</h3>
              <p className="text-muted-foreground">
                Suivez et gérez les dons de manière efficace et sécurisée.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-200 p-6 text-center">
            <CardContent>
              <Handshake className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">
                Assemblées générales
              </h3>
              <p className="text-muted-foreground">
                Organisez et gérez vos assemblées générales en toute simplicité.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-200 p-6 text-center">
            <CardContent>
              <LucideFile className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">
                Gestion des documents
              </h3>
              <p className="text-muted-foreground">
                Stockez et partagez vos documents importants en toute sécurité.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">Notre promesse</h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Amaly a été conçu pour vous offrir une expérience de gestion
            d&apos;association simplifiée et efficace. Avec notre plateforme
            intuitive, vous pouvez facilement gérer vos membres, suivre les
            dons, organiser des assemblées générales et stocker vos documents
            importants en toute sécurité.
          </p>
          <div className="mt-8">
            <Link href="/signup" legacyBehavior>
              <Button size="lg">Commencer maintenant</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
