"use client";
import { User, UserMembership, UserPatch } from "@/api/type";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { deleteUser, getUser, updateUser } from "@/api/services/user";
import { DetailsComp } from "@/components/common/DetailsComp";
import { EditModal, DeleteAlert } from "@/components/common/CrudModals";
import { toast } from "@/components/ui/use-toast";

interface UserDetailsProps {
  id: number;
}

export function UserDetails({ id }: UserDetailsProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  useEffect(() => {
    getUser(id).then((user) => setUser(user));
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleUpdate = async (data: UserPatch) => {
    try {
      const updatedUser = await updateUser(id, data);
      setUser(updatedUser);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      setIsEditModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      router.push("/admin/users");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DetailsComp
        entityName="Utilisateur"
        entityId={user.id}
        header={`${user.firstName} ${user.lastName}`}
        tabs={[
          {
            label: "Informations",
            content: (
              <div>
                <p>Email: {user.email}</p>
                <p>Créé le : {new Date(user.createdAt).toLocaleDateString()}</p>
                <p>Super Admin : {user.isSuperAdmin ? "Oui" : "Non"}</p>
              </div>
            ),
          },
          {
            label: "Organisations",
            content: (
              <ul>
                {user.memberships?.map((membership: UserMembership) => (
                  <li key={membership.id}>
                    {membership.organization.name} - {membership.role} -{" "}
                    {membership.isAdmin ? "Admin" : "Membre"}
                  </li>
                ))}
              </ul>
            ),
          },
        ]}
        sidebar={
          <div>
            <h3>Activité récente</h3>
            {/* Ajouter le feed des dernières actions de l'utilisateur */}
            <h3>Métriques</h3>
            <p>Nombre d&apos;organisations : {user.memberships?.length ?? 0}</p>
            {/* Ajouter d'autres indicateurs clés pour un utilisateur */}
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

      <EditModal<User>
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
        initialData={user}
        fields={[
          { name: "firstName", label: "First Name", type: "text" },
          { name: "lastName", label: "Last Name", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "isSuperAdmin", label: "Is Super Admin", type: "checkbox" },
        ]}
        title="Edit User"
      />

      <DeleteAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirm={handleDelete}
        itemName="user"
      />
    </>
  );
}
