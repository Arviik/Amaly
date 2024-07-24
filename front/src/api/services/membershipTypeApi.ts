import { api } from "../config";
import { MembershipType } from "../type";

export const membershipTypeApi = {
  getMembershipTypesByOrganizationId: async (
    organizationId: number
  ): Promise<MembershipType[]> => {
    const response = await api.get(
      `organization/${organizationId}/membershiptypes`
    );
    return response.json();
  },

  createMembershipType: async (
    organizationId: number,
    membershipType: Omit<MembershipType, "id">
  ): Promise<MembershipType> => {
    const response = await api.post(
      `organization/${organizationId}/membershiptypes`,
      {
        json: membershipType,
      }
    );
    return response.json();
  },

  updateMembershipType: async (
    id: number,
    membershipType: Partial<MembershipType>
  ): Promise<MembershipType> => {
    const response = await api.put(`membershiptypes/${id}`, {
      json: membershipType,
    });
    return response.json();
  },

  deleteMembershipType: async (id: number): Promise<void> => {
    await api.delete(`membershiptypes/${id}`);
  },
};
