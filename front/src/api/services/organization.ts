import { api } from "../config";
import { Organization, OrganizationPatch } from "../type";

export const getAllOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await api.get("organizations");
    return response.json();
  } catch (error) {
    console.error("Error fetching Organizations:", error);
    throw error;
  }
};

export const getOrganizationById = async (
  id: number
): Promise<Organization> => {
  try {
    const response = await api.get(`organizations/${id}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching Organization:", error);
    throw error;
  }
};

export const getOrganizationInviteWithUuid = async (
    uuid: string
): Promise<any> => {
  try {
    const response = await api.get(`organizations/invite?uuid=${uuid}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching Organization:", error);
    throw error;
  }
};

export const createInvitation = async (
    id: number
): Promise<any> => {
  try {
    const response = await api.get(`organizations/createinvite/${id}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching Organization:", error);
    throw error;
  }
};

export const createOrganization = async (
  OrganizationData: Pick<Organization, "name" | "type" | "address" | "email" | "phone" | "ownerId">
): Promise<Organization> => {
  try {
    const response = await api.post("organizations", {
      json: OrganizationData,
    });
    return response.json();
  } catch (error) {
    console.error("Error creating Organization:", error);
    throw error;
  }
};

export const updateOrganization = async (
  id: number,
  organizationData: Partial<OrganizationPatch>
): Promise<Organization> => {
  try {
    console.log("Updating Organization with data:", organizationData);
    const response = await api.patch(`organizations/${id}`, {
      json: organizationData,
    });
    return response.json();
  } catch (error) {
    console.error("Error updating Organization:", error);
    throw error;
  }
};

export const deleteOrganization = async (id: number): Promise<void> => {
  try {
    await api.delete(`organizations/${id}`);
  } catch (error) {
    console.error("Error deleting Organization:", error);
    throw error;
  }
};
