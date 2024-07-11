import { api } from "../config";
import { User } from "../type";

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get("users");
    return response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  try {
    await api.delete(`users/${userId}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const createUser = async (
  userData: Omit<User, "id" | "createdAt" | "updatedAt">
): Promise<User> => {
  try {
    const response = await api.post("users", { json: userData });
    return response.json();
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (
  userId: number,
  userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
): Promise<User> => {
  try {
    const response = await api.put(`users/${userId}`, { json: userData });
    return response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
