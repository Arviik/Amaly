import ky from 'ky'

const toBase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

export const uploadDocument = async (title: string, path: string, fileData: any, organizationId: number) => {
    let file = await toBase64(fileData)
    console.log(file)
    return await ky.post('http://localhost:3000/documents', {
        json: {
            title: title,
            description: "description",
            path: path,
            fileData: file,
            organizationId: organizationId
        }, headers: {'Content-Type': 'application/json'}
    }).json()
}

export const getAllDocuments = async () => {
    return await ky.get('http://localhost:3000/documents').json()
}

export const getDocument = async (id: number) => {
    return await ky.get(`http://localhost:3000/documents/${id}`).json()
}

export const renameDocument = async (id: number, newName: string) => {
    return await ky.patch(`http://localhost:3000/documents/${id}`, {json: {
            title: newName
        }}).json()
}

export const repathDocument = async (id: number, newPath: string) => {
    return await ky.patch(`http://localhost:3000/documents/${id}`, {json: {
            path: newPath
        }}).json()
}

export const deleteDocument = async (id: number) => {
    return await ky.delete(`http://localhost:3000/documents/${id}`).json()
}