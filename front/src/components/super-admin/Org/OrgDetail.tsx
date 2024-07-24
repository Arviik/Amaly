"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getOrganizationById,
  deleteOrganization,
  updateOrganization,
} from "@/api/services/organization";
import { Organization } from "@/api/type";
import { DetailsComp } from "@/components/common/DetailsComp";
import { EditModal, DeleteAlert } from "@/components/common/CrudModals";
import { toast } from "@/components/ui/use-toast";
import { AgList } from "@/app/(protected)/admin/organizations/__organizationComp/AgList";
import { DocumentsList } from "@/app/(protected)/admin/organizations/__organizationComp/DocumentsList";
import { OrganizationInfo } from "@/app/(protected)/admin/organizations/__organizationComp/OrganizationInfo";
import { MemberList } from "@/app/(protected)/admin/organizations/__organizationComp/MemberList";

interface OrganizationDetailsProps {
  id: number;
}

export function OrganizationDetails({ id }: OrganizationDetailsProps) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getOrganizationById(id).then((org) => setOrganization(org));
  }, [id]);

  if (!organization) {
    return <div>Loading...</div>;
  }

  const handleUpdate = async (data: Partial<Organization>) => {
    try {
      const updatedOrg = await updateOrganization(id, data);
      setOrganization(updatedOrg);
      toast({
        title: "Success",
        description: "Organization updated successfully",
      });
      setIsEditModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update organization",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOrganization(id);
      toast({
        title: "Success",
        description: "Organization deleted successfully",
      });
      router.push("/admin/organizations");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DetailsComp
        entityName="Organization"
        entityId={organization.id}
        header={organization.name}
        tabs={[
          {
            label: "Informations",
            content: <OrganizationInfo organization={organization} />,
          },
          {
            label: "Documents",
            content: <DocumentsList documents={organization.documents} />,
          },
          {
            label: "Assemblées Générales",
            content: <AgList ags={organization.ags} />,
          },
          {
            label: "Membres",
            content: <MemberList members={organization.members} />,
          },
        ]}
        sidebar={
          <div>
            <h3>Activité récente</h3>
            {/* Ajouter le feed des dernières actions sur l'organisation */}
            <h3>Métriques</h3>
            <p>Nombre de membres : {organization.members?.length ?? 0}</p>
            {/* Ajouter d'autres indicateurs clés pour une organisation */}
          </div>
        }
        actions={[
          {
            label: "Modifier",
            onClick: () => setIsEditModalOpen(true),
          },
          {
            label: "Supprimer",
            onClick: () => setIsDeleteAlertOpen(true),
          },
        ]}
      />

      <EditModal<Organization>
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
        initialData={organization}
        fields={[
          { name: "name", label: "Name", type: "text" },
          { name: "description", label: "Description", type: "text" },
          { name: "type", label: "Type", type: "text" },
          { name: "address", label: "Address", type: "text" },
          { name: "phone", label: "Phone", type: "text" },
          { name: "email", label: "Email", type: "email" },
        ]}
        title="Edit Organization"
      />

      <DeleteAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirm={handleDelete}
        itemName="organization"
      />
    </>
  );
}
