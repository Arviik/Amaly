"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getOrganizationById,
  deleteOrganization,
  updateOrganization,
} from "@/api/services/organization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Organization } from "@/api/type";
import { OrganizationDetails } from "@/components/super-admin/Org/OrgDetail";

interface OrganizationDetailsPageProps {
  params: { id: number };
}

const OrganizationDetailsPage = ({ params }: OrganizationDetailsPageProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrganization = async () => {
      const org = await getOrganizationById(Number(params.id));
      setOrganization(org);
    };
    fetchOrganization();
  }, [params.id]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (organization) {
      await deleteOrganization(organization.id);
      router.push("/super-admin/organizations");
    }
  };

  const handleOrganizationUpdate = async (
    updatedData: Partial<Organization>
  ) => {
    if (organization) {
      await updateOrganization(organization.id, updatedData);
      setOrganization({ ...organization, ...updatedData });
    }
  };

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <OrganizationDetails id={params.id} />
    </div>
  );
};

export default OrganizationDetailsPage;
