import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DashboardAdmin: React.FC = () => {
  console.log("DashboardAdmin");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content Section */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to the Dashboard</CardTitle>
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
                      <p>Manage your association members.</p>
                      <Link
                        href="/ManageMembers"
                        className="mt-2 inline-block text-primary hover:underline"
                      >
                        View Members
                      </Link>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Donations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Track and manage donations.</p>
                      <Link
                        href="/donations"
                        className="mt-2 inline-block text-primary hover:underline"
                      >
                        View Donations
                      </Link>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Organize and manage documents.</p>
                      <Link
                        href="/documents"
                        className="mt-2 inline-block text-primary hover:underline"
                      >
                        View Documents
                      </Link>
                    </CardContent>
                  </Card>
                  {/* Add more cards as needed */}
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
