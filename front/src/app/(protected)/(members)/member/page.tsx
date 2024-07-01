import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import LogoutButton from "@/components/public/LogoutButton";

const MemberDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Card>
              <CardHeader>
                <CardTitle>Tableau de bord Membre</CardTitle>
                <CardDescription>
                  Bienvenue sur votre espace membre Amaly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Mon Profil</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Consultez et mettez à jour vos informations
                        personnelles.
                      </p>
                      <Link
                        href="/profile"
                        className="mt-2 inline-block text-primary hover:underline"
                      >
                        Voir mon profil
                      </Link>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Mes Activités</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Consultez vos activités récentes au sein de
                        l&apos;association.
                      </p>
                      <Link
                        href="/activities"
                        className="mt-2 inline-block text-primary hover:underline"
                      >
                        Voir mes activités
                      </Link>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Événements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Découvrez les prochains événements de
                        l&apos;association.
                      </p>
                      <Link
                        href="/events"
                        className="mt-2 inline-block text-primary hover:underline"
                      >
                        Voir les événements
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <LogoutButton isCollapsed />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;
