import { Member } from "@/api/type";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface MemberListProps {
  members: Member[];
}

export const MemberList = ({ members }: MemberListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Membres</CardTitle>
      </CardHeader>
      <CardContent>
        <table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.user.id}>
                <TableCell>
                  {member.user.firstName} {member.user.lastName}
                </TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.isAdmin ? "Admin" : "Membre"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </table>
      </CardContent>
    </Card>
  );
};
