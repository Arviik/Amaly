import { getAllOrganizations } from "@/api/services/organization";
import { Organization } from "@/api/type";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, List } from "lucide-react";
import { useState, useEffect } from "react";

const NonprofitBoard = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [featuredOrganizations, setFeaturedOrganizations] = useState<
    Organization[]
  >([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [allOrgs, featuredOrgs, events] = await Promise.all([
        getAllOrganizations(),
        getFeaturedOrganizations(),
        getUpcomingEvents(),
      ]);
      setOrganizations(allOrgs);
      setFeaturedOrganizations(featuredOrgs);
      setUpcomingEvents(events);
    };

    fetchData();
  }, []);

  const filteredOrganizations = organizations.filter((org) =>
    Object.values(org).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div>
      <Header>
        <h1>Nonprofit Board</h1>
        <nav>
          <Link href="/">Accueil</Link>
          <Link href="/organizations">Organisations</Link>
          <Link href="/events">Événements</Link>
          <Link href="/about">À propos</Link>
        </nav>
        <div>
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button>Inscription</Button>
          <Button>Connexion</Button>
        </div>
      </Header>

      <section
        className="min-h-screen flex items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            Soutenez les associations qui vous tiennent à cœur
          </h1>
          <p className="text-xl text-white">
            Découvrez, rejoignez et faites un don aux organisations à but non
            lucratif
          </p>
          <Button className="mt-8">Faire un don</Button>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-bold mb-8">Organisations à la une</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {featuredOrganizations.map((org) => (
            <Card key={org.id}>
              <CardHeader>
                <CardTitle>{org.name}</CardTitle>
                <CardDescription>{org.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button>En savoir plus</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-bold mb-8">Événements à venir</h2>
        <List>
          {upcomingEvents.map((event) => (
            <ListItem key={event.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="text-gray-500">{event.date}</p>
                </div>
                <Button>Participer</Button>
              </div>
            </ListItem>
          ))}
        </List>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-bold mb-8">Notre impact</h2>
        <div className="flex flex-wrap justify-around">
          <Stat>
            <StatLabel>Organisations soutenues</StatLabel>
            <StatNumber>500+</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Bénévoles engagés</StatLabel>
            <StatNumber>10 000+</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Dons collectés</StatLabel>
            <StatNumber>1 000 000 €+</StatNumber>
          </Stat>
        </div>
        <div className="mt-8">
          <p className="italic text-xl">
            "Grâce à cette plateforme, nous avons pu trouver de nouveaux
            soutiens et développer nos actions"
          </p>
          <p className="text-gray-500">- Association XYZ</p>
        </div>
      </section>

      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-8">
          Vous êtes une organisation ?
        </h2>
        <p className="text-xl mb-8">
          Rejoignez notre plateforme pour gagner en visibilité et trouver de
          nouveaux soutiens.
        </p>
        <Button>En savoir plus</Button>
      </section>

      <Footer>{/* Ajoutez ici le contenu du footer */}</Footer>
    </div>
  );
};

export default NonprofitBoard;
