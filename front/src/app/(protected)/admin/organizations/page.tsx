"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  getAllOrganizations,
  deleteOrganization,
} from "@/api/services/organization";
import OrganizationFormModal from "@/components/super-admin/OrganizationFormModal";
import { Organization } from "@/api/type";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/common/Table";
import Link from "next/link";
import DeleteAlert from "@/components/common/DeleteAlert";

const OrganizationsPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<
    Organization | undefined
  >(undefined);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    const fetchedOrganizations = await getAllOrganizations();
    setOrganizations(fetchedOrganizations);
  };

  const handleDeleteOrganization = async (organizationId: number) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      await deleteOrganization(organizationId);
      setOrganizations(
        organizations.filter((org) => org.id !== organizationId)
      );
    }
  };

  const handleEditOrganization = (organization: Organization) => {
    setEditingOrganization(organization);
    setIsModalOpen(true);
  };

  const handleCreateOrganization = () => {
    setEditingOrganization(undefined);
    setIsModalOpen(true);
  };

  const handleOrganizationSubmit = (organization: Organization) => {
    if (editingOrganization) {
      setOrganizations(
        organizations.map((org) =>
          org.id === organization.id ? organization : org
        )
      );
    } else {
      setOrganizations([...organizations, organization]);
    }
  };

  const columns: ColumnDef<Organization>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <div
            className="cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <div
            className="cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Link href={`/admin/organizations/${row.original.id}`}>
            {row.original.name}
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const organization = row.original;
        return (
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditOrganization(row.original)}
            >
              Edit
            </Button>
            <DeleteAlert
              onDelete={() => handleDeleteOrganization(organization.id)}
              entityName="organization"
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Organization Management</h1>
      <Button className="mb-4" onClick={handleCreateOrganization}>
        Add New Organization
      </Button>
      <Table data={organizations} columns={columns} />
      <OrganizationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleOrganizationSubmit}
        organization={editingOrganization}
      />
    </div>
  );
};

export default OrganizationsPage;
