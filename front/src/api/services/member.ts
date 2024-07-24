import {api, tokenUtils} from "../config";
import { Member } from "../type";

export const getMembersByOrganizationId = async (
  organizationId: number
): Promise<Member[]> => {
  try {
    const response = await api.get(`organizations/${organizationId}/members`);
    return response.json();
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};

export const getMemberById = async (id: number): Promise<Member> => {
    try {
        const response = await api.get(`members/${id}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching member:", error);
        throw error;
    }
};

export const getMembershipsByUserId = async (id: number): Promise<any> => {
  try {
    const tokens = tokenUtils.getTokens
    const response = await api.get(`members/me`,{ headers: {"authorization": `Bearer ${tokens()?.accessToken}`}});
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération du membre:", error);
    throw error;
  }
};

export const createMember = async (
    memberData: Omit<Member, "id" | "createdAt" | "updatedAt">
): Promise<Member> => {
    try {
        const response = await api.post("members", {
            json: memberData,
        });
        return response.json();
    } catch (error) {
        console.error("Erreur lors de la création du membre:", error);
        throw error;
    }
};

export const updateMember = async (
  id: number,
  memberData: Partial<Member>
): Promise<Member> => {
  try {
    const response = await api.patch(`members/${id}`, {
      json: memberData,
    });
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la mise à jour du membre:", error);
    throw error;
  }
};

export const deleteMember = async (id: number): Promise<void> => {
    try {
        await api.delete(`members/${id}`);
    } catch (error) {
        console.error("Error deleting member:", error);
        throw error;
    }
};

export const inviteMember = async (
    organizationId: number,
    email: string
): Promise<void> => {
    try {
        await api.post(`organizations/${organizationId}/invite-member`, {
            json: { email },
        });
    } catch (error) {
        console.error("Error inviting member:", error);
        throw error;
    }
};