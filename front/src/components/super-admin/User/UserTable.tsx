"use client";
import {
  createUser,
  deleteUser,
  getAllUsers,
  resetPassword,
  updateUser,
} from "@/api/services/user";
import { User, UserPatch } from "@/api/type";
import { useCallback, useEffect, useState } from "react";
import { Field } from "../../common/CrudModals";
import { DataTable } from "../../common/DataTable";
import { toast } from "../../ui/use-toast";

const columns: { key: keyof User; header: string }[] = [
  { key: "id", header: "ID" },
  { key: "firstName", header: "First Name" },
  { key: "lastName", header: "Last Name" },
  { key: "email", header: "Email" },
  { key: "isSuperAdmin", header: "Super Admin" },
];

const fields: Field[] = [
  { name: "firstName", label: "First Name", type: "text" },
  { name: "lastName", label: "Last Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "isSuperAdmin", label: "Is Super Admin", type: "checkbox" },
];

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
      });
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = async (userData: Partial<User>) => {
    try {
      await createUser(userData as Omit<User, "id" | "updatedAt">);
      toast({
        title: "Success",
        description: "User created successfully",
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: number, userData: Partial<User>) => {
    try {
      console.log("Updating user with data:", userData);
      const { firstName, lastName, email } = userData;
      const updateData: UserPatch = { firstName, lastName, email };
      await updateUser(id, updateData);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
      alert("Error updating user");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (id: number) => {
    try {
      // Reset password logic
      await resetPassword(id);
      toast({
        title: "Success",
        description: "Password reset email sent",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email to user",
        variant: "destructive",
      });
    }
  };

  return (
    <DataTable<User>
      data={users}
      columns={columns}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onResetPassword={handleResetPassword}
      fields={fields}
    />
  );
}
