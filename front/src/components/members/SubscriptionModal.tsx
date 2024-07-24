import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubscriptionForm } from "./SubscriptionForm";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: number;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  organizationId,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscribe to a Membership</DialogTitle>
        </DialogHeader>
        <SubscriptionForm organizationId={organizationId} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
