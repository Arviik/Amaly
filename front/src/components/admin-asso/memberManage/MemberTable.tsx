"use client";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Member, MemberStatus } from "@/api/type";
import {
  getMembersByOrganizationId,
  updateMember,
  deleteMember,
  inviteMember,
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { selectSelectedOrganizationId } from "@/app/store/slices/authSlice";

type InviteMemberDialogProps = {
  onSubmit: (email: string) => void;
};

const InviteMemberDialog: React.FC<InviteMemberDialogProps> = ({
  onSubmit,
}) => {
  const [email, setEmail] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Inviter un membre</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inviter un membre</DialogTitle>
          <DialogDescription>
            Envoyez une invitation par e-mail ou partagez le lien
            d&apos;inscription.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={() => onSubmit(email)}>
            Envoyer l&apos;invitation
          </Button>
        </div>
        <DialogFooter>
          <p>Lien d&apos;inscription :</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
      status: formData.status,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier un membre</DialogTitle>
        </DialogHeader>
        <div>
          <label>
            Rôle:
            <Input
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
            />
          </label>
          <label>
            Admin:
            <Input
              type="checkbox"
              checked={formData.isAdmin}
              onChange={(e) => handleChange("isAdmin", e.target.checked)}
            />
          </label>
          <label>
            Statut:
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              {Object.values(MemberStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Prénom:
            <Input
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </label>
          <label>
            Nom:
            <Input
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </label>
          <label>
            E-mail:
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </label>
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
    }
  }, [organizationId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleInvite = async (email: string) => {
    try {
      await inviteMember(organizationId as number, email);
      toast({
        title: "Invitation envoyée",
        description: `Une invitation a été envoyée à ${email}.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'invitation.",
        variant: "destructive",
      });
    }
  };

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
    try {
      alert("Are you sure you want to delete this member?");
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
  };

  const filteredMembers = members.filter((member) =>
    Object.values(member).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <Input
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InviteMemberDialog onSubmit={handleInvite} />
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
                <Button variant="link" onClick={() => setEditingMember(member)}>
                  Modifier
                </Button>
                <Button variant="link" onClick={() => handleDelete(member.id)}>
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>
        <p>
          Page {currentPage} sur{" "}
          {Math.ceil(filteredMembers.length / itemsPerPage)}
        </p>
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
      {editingMember && (
        <EditMemberDialog
          member={editingMember}
          onSubmit={handleUpdate}
          onCancel={() => setEditingMember(null)}
        />
      )}
    </div>
  );
}

export default MemberManagement;
