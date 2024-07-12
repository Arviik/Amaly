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
import EditModal from "@/components/common/EditModal";
import DeleteAlert from "@/components/common/DeleteAlert";
import { Input } from "@/components/ui/input";
import { Organization } from "@/api/type";

interface OrganizationDetailsPageProps {
  params: { id: string };
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

  const renderOrganizationForm = (
    data: Partial<Organization>,
    handleChange: (field: keyof Organization, value: any) => void
  ) => (
    <>
      <div className="space-y-2">
        <label htmlFor="name">Name</label>
        <Input
          id="name"
          value={data.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="type">Type</label>
        <Input
          id="type"
          value={data.type || ""}
          onChange={(e) => handleChange("type", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="address">Address</label>
        <Input
          id="address"
          value={data.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="phone">Phone</label>
        <Input
          id="phone"
          value={data.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          value={data.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>
    </>
  );

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{organization.name}</h1>
      <Button onClick={() => router.back()} className="m-2 ">
        Back
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Type: {organization.type}</p>
            <p>Address: {organization.address}</p>
            <p>Phone: {organization.phone}</p>
            <p>Email: {organization.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleEdit} className="mr-2">
              Edit
            </Button>
            <DeleteAlert onDelete={handleDelete} entityName="organization" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activities</CardTitle>
          </CardHeader>
          <CardContent />
        </Card>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleOrganizationUpdate}
        initialData={organization}
        renderForm={renderOrganizationForm}
      />
    </div>
  );
};

export default OrganizationDetailsPage;
