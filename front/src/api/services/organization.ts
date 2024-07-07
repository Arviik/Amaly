import { api } from "../config";
import { Organization } from "../type";

export const getAllOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await api.get("organizations");
    return response.json();
  } catch (error) {
    console.error("Error fetching Organizations:", error);
    throw error;
  }
};

export const getOrganization = async (id: number): Promise<Organization> => {
  try {
    const response = await api.get(`organizations/${id}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching Organization:", error);
    throw error;
  }
};

export const createOrganization = async (
  OrganizationData: Omit<Organization, "id">
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
  OrganizationData: Partial<Organization>
): Promise<Organization> => {
  try {
    const response = await api.patch(`organizations/${id}`, {
      json: OrganizationData,
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
