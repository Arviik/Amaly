import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createOrganization } from "@/api/services/organization";
import { setSelectedOrganization } from "@/app/store/slices/authSlice";
import { useToast } from "@/components/ui/use-toast";
import { Organization, OrganizationPatch } from "@/api/type";

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOrganizationModal: React.FC<
  CreateOrganizationModalProps
> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<OrganizationPatch, "id">>({
    name: "",
    description: "",
    type: "",
    address: "",
    phone: "",
    email: "",
    ownerId: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newOrganization = await createOrganization(
        formData as Organization
      );
      dispatch(setSelectedOrganization(newOrganization.id));
      onClose();
      toast({
        title: "Success",
        description: "Organization created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger>
        <Button>Create Organization</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create a new organization</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <Input
            type="text"
            placeholder="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <Input
            type="tel"
            placeholder="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
