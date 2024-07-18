import { api } from "../config";
import { Membership } from "../type";

export const getMembershipsByMemberId = async (
  memberId: number
): Promise<Membership[]> => {
  try {
    const response = await api.get(`members/${memberId}/memberships`);
    return response.json();
  } catch (error) {
    console.error("Error fetching memberships:", error);
    throw error;
  }
};

export const createMembership = async (
  membershipData: Omit<Membership, "id" | "createdAt" | "updatedAt">
): Promise<Membership> => {
  try {
    const response = await api.post("memberships", { json: membershipData });
    return response.json();
  } catch (error) {
    console.error("Error creating membership:", error);
    throw error;
  }
};

export const updateMembership = async (
  id: number,
  membershipData: Partial<Membership>
): Promise<Membership> => {
  try {
    const response = await api.patch(`memberships/${id}`, {
      json: membershipData,
    });
    return response.json();
  } catch (error) {
    console.error("Error updating membership:", error);
    throw error;
  }
};

export const deleteMembership = async (id: number): Promise<void> => {
  try {
    await api.delete(`memberships/${id}`);
  } catch (error) {
    console.error("Error deleting membership:", error);
    throw error;
  }
};
