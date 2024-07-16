"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "@/components/common/DataTable";
import { Member } from "@/api/type";
import {
  getMembersByOrganizationId,
  createMember,
  updateMember,
  deleteMember,
} from "@/api/services/member";
import { useToast } from "@/components/ui/use-toast";
import { Field } from "@/components/common/CrudModals";
import { selectSelectedOrganizationId } from "@/app/store/slices/authSlice";

const columns: { key: keyof Member; header: string }[] = [
  { key: "id", header: "ID" },
  { key: "membershipType", header: "Membership Type" },
  { key: "status", header: "Status" },
  { key: "startDate", header: "Start Date" },
  { key: "endDate", header: "End Date" },
  { key: "employmentType", header: "Employment Type" },
];

const fields: Field[] = [
  { name: "membershipType", label: "Membership Type", type: "text" },
  { name: "status", label: "Status", type: "text" },
  { name: "startDate", label: "Start Date", type: "date" },
  { name: "endDate", label: "End Date", type: "date" },
  { name: "employmentType", label: "Employment Type", type: "text" },
];

export function MemberTable() {
  const [members, setMembers] = useState<Member[]>([]);
  const { toast } = useToast();
  const selectedOrganizationId = useSelector(selectSelectedOrganizationId);

  const fetchMembers = useCallback(async () => {
    if (!selectedOrganizationId) {
      toast({
        title: "Error",
        description: "No organization selected",
        variant: "destructive",
      });
      return;
    }
    try {
      const data = await getMembersByOrganizationId(selectedOrganizationId);
      console.log(data);
      setMembers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch members",
        variant: "destructive",
      });
    }
  }, [selectedOrganizationId, toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleCreate = async (data: Partial<Member>) => {
    if (!selectedOrganizationId) {
      toast({
        title: "Error",
        description: "No organization selected",
        variant: "destructive",
      });
      return;
    }
    try {
      await createMember({
        ...data,
        organizationId: selectedOrganizationId,
      } as Omit<Member, "id">);
      toast({
        title: "Success",
        description: "Member created successfully",
      });
      fetchMembers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create member",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: number, data: Partial<Member>) => {
    try {
      const { id: _, ...updateData } = data;
      await updateMember(id, updateData);
      toast({
        title: "Success",
        description: "Member updated successfully",
      });
      fetchMembers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMember(id);
      toast({
        title: "Success",
        description: "Member deleted successfully",
      });
      fetchMembers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete member",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <DataTable<Member>
        data={members}
        columns={columns}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        fields={fields}
      />
    </div>
  );
}
