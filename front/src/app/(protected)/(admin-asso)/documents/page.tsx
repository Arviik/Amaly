import React from "react";
import { PlusCircle, Trash } from "lucide-react";

interface Document {
  id: number;
  name: string;
  description: string;
}

const DocumentManagementPage: React.FC = () => {
  // Exemple de données de documents
  const documents: Document[] = [
    { id: 1, name: "Document 1", description: "Description of document 1" },
    { id: 2, name: "Document 2", description: "Description of document 2" },
    { id: 3, name: "Document 3", description: "Description of document 3" },
  ];

  // Fonction pour supprimer un document
  const deleteDocument = (id: number) => {
    // Logique pour supprimer le document avec l'ID spécifié
    console.log(`Document with ID ${id} deleted.`);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Document Management</h1>
      <div className="mb-4 flex items-center">
        <button className="flex items-center px-3 py-2 rounded bg-primary text-primary-foreground hover:bg-primary-dark hover:text-primary">
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Document
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((document) => (
              <tr key={document.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {document.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {document.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-red-600 hover:text-red-900">
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentManagementPage;
