import {api, tokenUtils} from "../config";
import { Activity, ActivityPatch } from "../type";

export const getAllActivities = async (): Promise<Activity[]> => {
    try {
        const response = await api.get("activities");
        return response.json();
    } catch (error) {
        console.error("Error fetching Activities:", error);
        throw error;
    }
};

export const getActivityById = async (
    id: number
): Promise<Activity> => {
    try {
        const response = await api.get(`activities/${id}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching Activity:", error);
        throw error;
    }
};

export const getActivityByOrganizationId = async (
    id: number
): Promise<Activity[]> => {
    try {
        const response = await api.get(`activities/organization/${id}`);
        return response.json();
    } catch (error) {
        console.error("Error fetching Activity:", error);
        throw error;
    }
};

export const declareActivityAttendance = async (id: number, data: any) => {
    try {
        const tokens = tokenUtils.getTokens
        return await api.post(`activityAttendance/${id}`, { json: data, headers: {"authorization": `Bearer ${tokens()?.accessToken}`} }).json();
    } catch (error) {
        console.error('Error creating AGS:', error);
        throw error;
    }
};

export const getActivityAttendance = async (id: number, data: any): Promise<any|null> => {
    try {
        const tokens = tokenUtils.getTokens
        return await api.post(`getActivityAttendance/${id}`, { json: data, headers: {"authorization": `Bearer ${tokens()?.accessToken}`} }).json();
    } catch (error) {
        console.error('Error creating AGS:', error);
        throw error;
    }
};

export const unregisterActivityAttendance = async (id: number, data: any) => {
    try {
        const tokens = tokenUtils.getTokens
        return await api.delete(`activityAttendance/${id}`, { json: data, headers: {"authorization": `Bearer ${tokens()?.accessToken}`} }).json();
    } catch (error) {
        console.error('Error creating AGS:', error);
        throw error;
    }
};

export const createActivity = async (
    activityData: Omit<Activity, "id">
): Promise<Activity> => {
    try {
        const response = await api.post("activities", {
            json: activityData,
        });
        return response.json();
    } catch (error) {
        console.error("Error creating Activity:", error);
        throw error;
    }
};

export const updateActivity = async (
    id: number,
    activityData: Partial<ActivityPatch>
): Promise<Activity> => {
    try {
        const response = await api.patch(`activities/${id}`, {
            json: activityData,
        });
        return response.json();
    } catch (error) {
        console.error("Error updating Activity:", error);
        throw error;
    }
};

export const deleteActivity = async (id: number): Promise<void> => {
    try {
        await api.delete(`activities/${id}`);
    } catch (error) {
        console.error("Error deleting Activity:", error);
        throw error;
    }
};
