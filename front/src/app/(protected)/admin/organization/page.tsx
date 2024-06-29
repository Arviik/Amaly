"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAllOrganizations,
  deleteOrganization,
} from "@/api/services/organization";
import OrganizationFormModal from "@/components/super-admin/OrganizationFormModal";
import { Organization } from "@/api/type";

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Organization Management</h1>
      <Button className="mb-4" onClick={handleCreateOrganization}>
        Add New Organization
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((organization) => (
            <TableRow key={organization.id}>
              <TableCell>{organization.id}</TableCell>
              <TableCell>{organization.name}</TableCell>
              <TableCell>{organization.type}</TableCell>
              <TableCell>{organization.address}</TableCell>
              <TableCell>{organization.phone}</TableCell>
              <TableCell>{organization.email}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => handleEditOrganization(organization)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteOrganization(organization.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
