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
  const { organizationId } = useParams();

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const response = await getMembersByOrganizationId(
          Number(organizationId)
        );
        setMembers(response);
      } catch (err) {
        setError(
          "Une erreur est survenue lors de la récupération des membres."
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [organizationId]);

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Rôle",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
    // Ajoutez d'autres colonnes selon vos besoins
  ];

  if (isLoading) return <div>loading of members...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Liste of Members</h1>
      <Table data={members} columns={columns} />
    </div>
  );
};

export default MembersList;
