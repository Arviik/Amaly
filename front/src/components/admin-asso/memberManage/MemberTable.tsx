"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Member, MemberStatus } from "@/api/type";
import {
  getMembersByOrganizationId,
  updateMember,
  deleteMember,
} from "@/api/services/member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { selectSelectedOrganizationId } from "@/app/store/slices/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface EditMemberDialogProps {
  member: Member;
  onSubmit: (member: Member) => void;
  onCancel: () => void;
}

const EditMemberDialog = ({
  member,
  onSubmit,
  onCancel,
}: EditMemberDialogProps) => {
  const [formData, setFormData] = useState({
    role: member.role,
    isAdmin: member.isAdmin,
    status: member.status,
    firstName: member.user.firstName,
    lastName: member.user.lastName,
    email: member.user.email,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...member,
      role: formData.role,
      isAdmin: formData.isAdmin,
      status: formData.status as MemberStatus,
      user: {
        ...member.user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      },
    });
  };

  return (
    <Dialog open={!!member} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier un membre</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Rôle
            </Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isAdmin" className="text-right">
              Admin
            </Label>
            <Switch
              id="isAdmin"
              checked={formData.isAdmin}
              onCheckedChange={(checked: boolean) =>
                handleChange("isAdmin", checked)
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Statut
            </Label>
            <Select
              onValueChange={(value) => handleChange("status", value)}
              defaultValue={formData.status}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionnez un statut" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(MemberStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              Prénom
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Nom
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Sauvegarder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function MemberManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const organizationId = useSelector(selectSelectedOrganizationId);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchMembers = useCallback(async () => {
    try {
      const data = await getMembersByOrganizationId(organizationId as number);
      setMembers(data);
    } catch (error) {
      console.error("Failed to fetch members", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la liste des membres.",
        variant: "destructive",
      });
    }
  }, [organizationId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleUpdate = async (member: Member) => {
    try {
      await updateMember(member.id, member);
      fetchMembers();
      setEditingMember(null);
      toast({
        title: "Membre mis à jour",
        description:
          "Les informations du membre ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la mise à jour du membre.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      try {
        await deleteMember(id);
        fetchMembers();
        toast({
          title: "Membre supprimé",
          description: "Le membre a été supprimé avec succès.",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description:
            "Une erreur est survenue lors de la suppression du membre.",
          variant: "destructive",
        });
      }
    }
  };

  const filteredMembers = useMemo(() => {
    return members.filter((member) =>
      Object.values(member).some((value) => {
        if (value === null || value === undefined) {
          return false;
        }
        if (typeof value === "object") {
          return Object.values(value).some((nestedValue) =>
            String(nestedValue).toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [members, searchTerm]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  return (
    <main>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.id}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.isAdmin ? "Oui" : "Non"}</TableCell>
                <TableCell>{member.status}</TableCell>
                <TableCell>{member.user.firstName}</TableCell>
                <TableCell>{member.user.lastName}</TableCell>
                <TableCell>{member.user.email}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => setEditingMember(member)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(member.id)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <span>
            Page {currentPage} sur{" "}
            {Math.ceil(filteredMembers.length / itemsPerPage)}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(filteredMembers.length / itemsPerPage)
            }
          >
            Suivant
          </Button>
        </div>
      </CardContent>
      {editingMember && (
        <EditMemberDialog
          member={editingMember}
          onSubmit={handleUpdate}
          onCancel={() => setEditingMember(null)}
        />
      )}
    </main>
  );
}

export default MemberManagement;
