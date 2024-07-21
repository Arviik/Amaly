"use client";
import { getAllOrganizations } from "@/api/services/organization";
import { Organization } from "@/api/type";
import { OrganizationCard } from "@/components/public/nonProfitBoard/OrganizationCard";
import { useEffect, useState } from "react";

export default function NonprofitBoardPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrganizations().then((orgs) => {
      setOrganizations(orgs);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations.map((org) => (
              <OrganizationCard key={org.id} organization={org} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
