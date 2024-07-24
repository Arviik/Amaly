import { getUserById } from "@/api/services/user";
import { Member, MembershipMember, User } from "@/api/type";

export type CustomMember = {
  id: number;
  fullName: string;
  email: string;
  joinDate: Date;
  role: string;
  memberStatut: string;
  // Ajoutez d'autres champs si nécessaire
};

export async function customizeMember(member: Member): Promise<CustomMember> {
  const userResponse: User = await getUserById(member.userId);

  const customeMember: CustomMember = {
    id: member.id,
    fullName: userResponse.firstName + " " + userResponse.lastName,
    email: userResponse.email,
    joinDate: member.createdAt,
    role: member.role,
    memberStatut: member.membership.status,
    // Ajoutez d'autres champs si nécessaire
  };

  return customeMember;
}
