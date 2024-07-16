"use client";
import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
  updateOrganization,
} from "@/api/services/organization";
import { Organization } from "@/api/type";
import { Field } from "@/components/common/CrudModals";
import { DataTable } from "@/components/common/DataTable";
import { useToast } from "@/components/ui/use-toast";
import { useCallback, useEffect, useState } from "react";

const columns: { key: keyof Organization; header: string }[] = [
  { key: "name", header: "Name" },
  { key: "type", header: "Type" },
  { key: "address", header: "Address" },
  { key: "phone", header: "Phone" },
  { key: "email", header: "Email" },
];

const fields: Field[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "description", label: "Description", type: "text" },
  { name: "type", label: "Type", type: "text" },
  { name: "address", label: "Address", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "email", label: "Email", type: "email" },
];

export function OrganizationTable() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { toast } = useToast();

  const fetchOrganizations = useCallback(async () => {
    try {
      const data = await getAllOrganizations();
      setOrganizations(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch organizations",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleCreate = async (data: Partial<Organization>) => {
    try {
      await createOrganization(data as Omit<Organization, "id">);
      toast({
        title: "Success",
        description: "Organization created successfully",
      });
      fetchOrganizations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: number, data: Partial<Organization>) => {
    try {
      const { id: _, createdAt, updatedAt, ...updateData } = data;
      console.log(" updateData", updateData);

      console.log("Updating organization with data:", data);

      await updateOrganization(id, updateData);
      toast({
        title: "Success",
        description: "Organization updated successfully",
      });
      fetchOrganizations();
    } catch (error) {
      console.error("Error updating organization:", error);
      toast({
        title: "Error",
        description: "Failed to update organization",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOrganization(id);
      toast({
        title: "Success",
        description: "Organization deleted successfully",
      });
      fetchOrganizations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive",
      });
    }
  };

  return (
    <DataTable<Organization>
      data={organizations}
      columns={columns}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      fields={fields}
    />
  );
}
