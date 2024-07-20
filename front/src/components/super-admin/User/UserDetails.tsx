"use client";
import { User } from "@/api/type";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getUser } from "@/api/services/user";
import { DetailsComp } from "@/components/common/DetailsComp";

interface UserDetailsProps {
  id: number;
}

export function UserDetails({ id }: UserDetailsProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser(id).then((user) => setUser(user));
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
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
              {/* Ajouter les autres informations de l'utilisateur */}
            </div>
          ),
        },
        {
          label: "Organisations",
          content: (
            <ul>
              {user.memberships?.map((membership) => (
                <li key={membership.id}>
                  {membership.organizationName} -{" "}
                  {membership.isAdmin ? "Admin" : "Membre"}
                </li>
              ))}
            </ul>
          ),
        },
        // Ajouter les autres onglets pertinents pour un utilisateur
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
          onClick: () => {
            // Ouvrir le modal d'édition de l'utilisateur
          },
        },
        {
          label: "Supprimer",
          onClick: () => {
            // Ouvrir le modal de confirmation de suppression de l'utilisateur
          },
        },
        // Ajouter les autres actions pertinentes pour un utilisateur
      ]}
    />
  );
}
