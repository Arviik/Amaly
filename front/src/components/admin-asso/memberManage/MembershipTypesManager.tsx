import { membershipTypeApi } from "@/api/services/membershipTypeApi";
import { MembershipType } from "@/api/type";
import { selectSelectedOrganizationId } from "@/app/store/slices/authSlice";
import { DataTable } from "@/components/common/DataTable";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const columns: { key: keyof MembershipType; header: string }[] = [
  { key: "name", header: "Name" },
  { key: "duration", header: "Duration (months)" },
  { key: "description", header: "Description" },
  { key: "amount", header: "Fee" },
];

const fields = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "description", label: "Description", type: "text", required: true },
  { name: "amount", label: "Fee", type: "number", required: true, min: 0 },
  {
    name: "duration",
    label: "Duration (months)",
    type: "number",
    required: true,
    min: 1,
  },
];

const MembershipTypesManager = () => {
  const organizationId = useSelector(selectSelectedOrganizationId);
  const [membershipTypes, setMembershipTypes] = useState<MembershipType[]>([]);

  useEffect(() => {
    const fetchMembershipTypes = async () => {
      if (organizationId) {
        const types =
          await membershipTypeApi.getMembershipTypesByOrganizationId(
            organizationId
          );
        console.log("je suis dans le use effect", types);
        setMembershipTypes(types);
      }
    };
    fetchMembershipTypes();
  }, [organizationId]);

  if (!organizationId) {
    console.log("je suis dans le else");
    return null;
  }

  const handleCreate = async (data: Partial<MembershipType>) => {
    try {
      const newType = await membershipTypeApi.createMembershipType(
        organizationId,
        {
          ...(data as Omit<MembershipType, "id">),
          organizationId,
        }
      );
      setMembershipTypes([...membershipTypes, newType]);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la création du type de membre.",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: number, data: Partial<MembershipType>) => {
    const updatedType = await membershipTypeApi.updateMembershipType(id, data);
    setMembershipTypes(
      membershipTypes.map((type) => (type.id === id ? updatedType : type))
    );
  };

  const handleDelete = async (id: number) => {
    await membershipTypeApi.deleteMembershipType(id);
    setMembershipTypes(membershipTypes.filter((type) => type.id !== id));
  };
  return (
    <div>
      <DataTable
        data={membershipTypes}
        columns={columns}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        fields={fields}
      />
    </div>
  );
};

export default MembershipTypesManager;
