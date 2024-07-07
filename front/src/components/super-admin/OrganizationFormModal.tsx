import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createOrganization,
  updateOrganization,
} from "@/api/services/organization";
import { Organization } from "@/api/type";

interface OrganizationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (organization: Organization) => void;
  organization?: Organization;
}

const OrganizationFormModal: React.FC<OrganizationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  organization,
}) => {
  const [formData, setFormData] = useState<Partial<Organization>>(
    organization || {}
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let result;
      if (organization) {
        result = await updateOrganization(organization.id, formData);
      } else {
        result = await createOrganization(formData as Omit<Organization, "id">);
      }
      onSubmit(result);
      onClose();
    } catch (error) {
      console.error("Error submitting organization:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {organization ? "Edit Organization" : "Create New Organization"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              name="name"
              placeholder="Name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="type"
              placeholder="Type"
              value={formData.type || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="address"
              placeholder="Address"
              value={formData.address || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="phone"
              placeholder="Phone"
              value={formData.phone || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit">{organization ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationFormModal;
