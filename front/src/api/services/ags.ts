import ky from 'ky';
import {AGs} from "@/api/type";
import {tokenUtils} from "@/api/config";

const api = ky.create({
    prefixUrl: 'http://localhost:3000', // Remplacez par l'URL de votre serveur
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAllAGS = async () => {
    try {
        return await api.get('ags').json();
    } catch (error) {
        console.error('Error fetching all AGS:', error);
        throw error;
    }
};

export const getAGSById = async (id: number): Promise<AGs> => {
    try {
        return await api.get(`ags/${id}`).json();
    } catch (error) {
        console.error(`Error fetching AGS with id ${id}:`, error);
        throw error;
    }
};

export const getAGSByOrganizationId = async (id: number): Promise<AGs[]> => {
    try {
        return await api.get(`ags/organization/${id}`).json();
    } catch (error) {
        console.error(`Error fetching AGS with id ${id}:`, error);
        throw error;
    }
};

export const createAGS = async (data: any) => {
    try {
        return await api.post('ags', { json: data }).json();
    } catch (error) {
        console.error('Error creating AGS:', error);
        throw error;
    }
};

export const declareAttendance = async (id: number, data: any) => {
    try {
        const tokens = tokenUtils.getTokens
        return await api.post(`attendance/${id}`, { json: data, headers: {"authorization": `Bearer ${tokens()?.accessToken}`} }).json();
    } catch (error) {
        console.error('Error creating AGS:', error);
        throw error;
    }
};

export const updateAGS = async (id: number, data: any) => {
    try {
        return await api.patch(`ags/${id}`, { json: data }).json();
    } catch (error) {
        console.error(`Error updating AGS with id ${id}:`, error);
        throw error;
    }
};

export const deleteAGS = async (id: number) => {
    try {
        return await api.delete(`ags/${id}`).json();
    } catch (error) {
        console.error(`Error deleting AGS with id ${id}:`, error);
        throw error;
    }
};
