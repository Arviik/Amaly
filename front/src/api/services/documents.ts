import ky from 'ky'
import {api} from "../config"

const toBase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

export const uploadDocument = async (title: string, path: string, fileData: any, organizationId: number) => {
    let file = await toBase64(fileData)
    return await ky.post('/documents', {
        json: {
            title: title,
            description: "description",
            path: path,
            fileData: file,
            organizationId: organizationId
        }, headers: {'Content-Type': 'application/json'}
    }).json()
}

export const getAllDocumentsFromOrganization = async (id: number) => {
    return await api.get(`documents/organization/${id}`).json()
}


export const getDocument = async (id: number) => {
    return await api.get(`documents/${id}`).json()
}

export const renameDocument = async (id: number, newName: string) => {
    return await api.patch(`documents/${id}`, {json: {
            title: newName
        }}).json()
}

export const repathDocument = async (id: number, newPath: string) => {
    return await api.patch(`documents/${id}`, {json: {
            path: newPath
        }}).json()
}

export const deleteDocument = async (id: number) => {
    return await api.delete(`documents/${id}`).json()
}