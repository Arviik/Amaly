import React from "react";
import { PlusCircle, Trash } from "lucide-react";

interface Member {
  id: number;
  name: string;
  email: string;
  isMember: boolean;
}

const MemberManagementPage: React.FC = () => {
  // Exemple de données de membres
  const members: Member[] = [
    { id: 1, name: "John Doe", email: "john@example.com", isMember: true },
    { id: 2, name: "Jane Smith", email: "jane@example.com", isMember: false },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice@example.com",
      isMember: true,
    },
  ];

  // Fonction pour supprimer un membre
  const deleteMember = (id: number) => {
    // Logique pour supprimer le membre avec l'ID spécifié
    console.log(`Member with ID ${id} deleted.`);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Member Management</h1>
      <div className="mb-4 flex items-center">
        <button className="flex items-center px-3 py-2 rounded bg-primary text-primary-foreground hover:bg-primary-dark hover:text-primary">
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Member
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
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Member Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {member.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{member.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {member.isMember ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Member
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Not a Member
                    </span>
                  )}
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

export default MemberManagementPage;
