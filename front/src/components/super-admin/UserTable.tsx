"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DataTable } from "../common/DataTable";
import { User } from "@/api/type";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/api/services/user";
import { Field } from "../common/CreateModal";

const columns: { key: keyof User; header: string }[] = [
  { key: "id" as keyof User, header: "ID" },
  { key: "firstName" as keyof User, header: "First Name" },
  { key: "lastName" as keyof User, header: "Last Name" },
  { key: "email" as keyof User, header: "Email" },
  { key: "isSuperAdmin" as keyof User, header: "Super Admin" },
];

const fields: Field[] = [
  { name: "firstName", label: "First Name", type: "text" },
  { name: "lastName", label: "Last Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password" },
  { name: "isSuperAdmin", label: "Is Super Admin", type: "checkbox" },
];

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  const handleCreate = async (userData: Partial<User>) => {
    const newUser = await createUser(
      userData as Omit<User, "id" | "updatedAt">
    );
    setUsers([...users, newUser]);
  };

  const handleUpdate = async (id: number, userData: Partial<User>) => {
    const updatedUser = await updateUser(id, userData as User);
    setUsers(users.map((user) => (user.id === id ? updatedUser : user)));
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleResetPassword = (id: number) => {
    alert("Reset password not implemented yet");
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
