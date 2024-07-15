import { Currency, Handshake, LucideFile, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import FeatureCard from "@/components/public/FeatureCard";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";

const features = [
  {
    icon: User,
    title: "Gestion des membres",
    description:
      "Gérez facilement les adhésions, les statuts et les informations de vos membres.",
  },
  {
    icon: Currency,
    title: "Gestion des dons",
    description: "Suivez et gérez les dons de manière efficace et sécurisée.",
  },
  {
    icon: Handshake,
    title: "Assemblées générales",
    description:
      "Organisez et gérez vos assemblées générales en toute simplicité.",
  },
  {
    icon: LucideFile,
    title: "Gestion des documents",
    description:
      "Stockez et partagez vos documents importants en toute sécurité.",
  },
];

export default function RootPage() {
  console.log("RootPage");
  return (
    <main>
      <div className="container mx-auto py-12 px-4">
        <section className="text-center py-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Simplifiez la gestion de votre association avec{" "}
            <span className="text-primary">Amaly</span>
          </h1>
          <p className="max-w-3xl mx-auto mt-4 text-lg sm:text-xl text-muted-foreground">
            Une solution tout-en-un pour gérer vos membres, vos dons, vos
            assemblées générales et vos documents importants.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link href="/login" passHref>
              <Button size="lg">Se connecter</Button>
            </Link>
            <Link href="/signup" passHref>
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
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>

        <section className="bg-gray-50 py-12 rounded-lg">
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
              <Link href="/signup" passHref>
                <Button size="lg">Commencer maintenant</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
