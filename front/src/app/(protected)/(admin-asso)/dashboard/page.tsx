"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import React from "react";

const DashboardAdmin: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-100">
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to the Admin Dashboard</CardTitle>
                <CardDescription>
                  Manage your association effectively with Amaly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">65</p>
                      <p className="text-sm text-muted-foreground">
                        Total members
                      </p>
                      <div className="h-[200px] bg-gray-100 mt-4 flex items-center justify-center">
                        Graph placeholder
                      </div>
                      <Button asChild className="mt-4 w-full">
                        <Link href="/ManageMembers">Manage Members</Link>
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Donations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">$10,000</p>
                      <p className="text-sm text-muted-foreground">
                        Total donations this year
                      </p>
                      <div className="h-[200px] bg-gray-100 mt-4 flex items-center justify-center">
                        Graph placeholder
                      </div>
                      <Button asChild className="mt-4 w-full">
                        <Link href="/donations">View Donations</Link>
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">125</p>
                      <p className="text-sm text-muted-foreground">
                        Total documents
                      </p>
                      <ul className="mt-4 space-y-2">
                        <li className="text-sm">Financial Reports: 20</li>
                        <li className="text-sm">Meeting Minutes: 35</li>
                        <li className="text-sm">Event Plans: 45</li>
                        <li className="text-sm">Other: 25</li>
                      </ul>
                      <Button asChild className="mt-4 w-full">
                        <Link href="/documents">Manage Documents</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;
