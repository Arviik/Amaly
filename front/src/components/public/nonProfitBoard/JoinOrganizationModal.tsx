"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/api/config";

interface JoinOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: number;
  organizationName: string;
  onJoin: () => void;
}

export const JoinOrganizationModal: React.FC<JoinOrganizationModalProps> = ({
  isOpen,
  onClose,
  organizationId,
  organizationName,
  onJoin,
}) => {
  const [acceptedCharter, setAcceptedCharter] = useState(false);

  const handleJoin = async () => {
    if (!acceptedCharter) return;

    try {
      console.log("Joining organization", organizationId);

      const response = await api.post(`organizations/${organizationId}/join`);

      if (response.ok) {
        onJoin();
        onClose();
      } else {
        // Gérer l'erreur
        console.error("Failed to join organization");
      }
    } catch (error) {
      console.error("Error joining organization:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join {organizationName}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p>Please read and accept the organization&apos;s charter:</p>
          <div className="mt-4 max-h-60 overflow-y-auto p-4 border rounded">
            <p>Charter content goes here...</p>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <Checkbox
              id="accept-charter"
              checked={acceptedCharter}
              onCheckedChange={(checked) =>
                setAcceptedCharter(checked as boolean)
              }
            />
            <label htmlFor="accept-charter">
              I accept the organization&apos;s charter
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleJoin} disabled={!acceptedCharter}>
            Join
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
