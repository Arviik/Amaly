"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authService } from "@/api/services/auth";

const superAdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Card>
              <CardHeader>
                <CardTitle>Tableau de bord Super Admin</CardTitle>
                <CardDescription>
                  Gérez efficacement toutes les associations avec Amaly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Associations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Gérez toutes les associations enregistrées.</p>
                      <Link
                        href="/associations"
                        className="mt-2 inline-block text-primary hover:underline"
                      >
                        Voir les associations
                      </Link>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Utilisateurs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Gérez tous les utilisateurs de la plateforme.</p>
                      <Link
                        href="/users"
                        className="mt-2 inline-block text-primary hover:underline"
                      >
                        Voir les utilisateurs
                      </Link>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Rapports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Accédez aux rapports et statistiques globaux.</p>
                      <Link
                        href="/reports"
                        className="mt-2 inline-block text-primary hover:underline"
                      >
                        Voir les rapports
                      </Link>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button variant="destructive" onClick={authService.logout}>
                    Déconnexion
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default superAdminDashboard;
