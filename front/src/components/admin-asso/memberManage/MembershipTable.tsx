"use client";
import React, { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/common/DataTable";
import { Membership } from "@/api/type";
import {
  getMembershipsByMemberId,
  createMembership,
  updateMembership,
  deleteMembership,
} from "@/api/services/membership";
import { useToast } from "@/components/ui/use-toast";
import { Field } from "@/components/common/CrudModals";

const columns: { key: keyof Membership; header: string }[] = [
  { key: "id", header: "ID" },
  { key: "status", header: "Status" },
  { key: "startDate", header: "Start Date" },
  { key: "endDate", header: "End Date" },
];

const fields: Field[] = [
  { name: "status", label: "Status", type: "text" },
  { name: "startDate", label: "Start Date", type: "date" },
  { name: "endDate", label: "End Date", type: "date" },
];

interface MembershipTableProps {
  memberId: number;
}

export function MembershipTable({ memberId }: MembershipTableProps) {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const { toast } = useToast();

  const fetchMemberships = useCallback(async () => {
    try {
      const data = await getMembershipsByMemberId(memberId);
      setMemberships(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch memberships",
        variant: "destructive",
      });
    }
  }, [memberId, toast]);

  useEffect(() => {
    fetchMemberships();
  }, [fetchMemberships]);

  const handleCreate = async (data: Partial<Membership>) => {
    try {
      await createMembership({
        ...data,
        memberId,
      } as Omit<Membership, "id" | "createdAt" | "updatedAt">);
      toast({
        title: "Success",
        description: "Membership created successfully",
      });
      fetchMemberships();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create membership",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: number, data: Partial<Membership>) => {
    try {
      await updateMembership(id, data);
      toast({
        title: "Success",
        description: "Membership updated successfully",
      });
      fetchMemberships();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update membership",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMembership(id);
      toast({
        title: "Success",
        description: "Membership deleted successfully",
      });
      fetchMemberships();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete membership",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Memberships</h2>
      <DataTable<Membership>
        data={memberships}
        columns={columns}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        fields={fields}
      />
    </div>
  );
}
