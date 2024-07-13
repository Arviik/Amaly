import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getMembersByOrganizationId } from "@/api/services/member";
import Table from "@/components/common/Table";
import { Member } from "@/api/type";
import { ColumnDef } from "@tanstack/react-table";

const MembersList: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const organizationId = 1;

  useEffect(() => {
    fetchMembers();
  }, [organizationId]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await getMembersByOrganizationId(organizationId);
      console.log(response);
      setMembers(response);
    } catch (err) {
      setError("Une erreur est survenue lors de la récupération des membres.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "membershipType",
      header: "Type d'adhésion",
    },
    {
      accessorKey: "status",
      header: "Statut",
    },
    {
      accessorKey: "startDate",
      header: "Date de début",
    },
    {
      accessorKey: "endDate",
      header: "Date de fin",
    },
    {
      accessorKey: "employmentType",
      header: "Type d'emploi",
    },
    {
      accessorKey: "createdAt",
      header: "Date de création",
    },
    {
      accessorKey: "updatedAt",
      header: "Date de mise à jour",
    },
    {
      accessorKey: "isAdmin",
      header: "Admin",
    },
  ];

  if (isLoading) return <div>Chargement des membres...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Liste des Membres</h1>
      <Table data={members} columns={columns} />
    </div>
  );
};

export default MembersList;
