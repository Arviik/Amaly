import { createOrganization } from "@/api/services/organization";
import { Organization, UserMembership } from "@/api/type";
import { RootState } from "@/app/store";
import {
  setCurrentMember,
  setSelectedOrganization,
} from "@/app/store/slices/authSlice";
import { CreateOrganizationModal } from "@/components/public/CreateOrganizationModal";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function ComboBox() {
  const dispatch = useDispatch();
  const router = useRouter();
  const memberships = useSelector((state: RootState) => state.auth.memberships);
  const selectedOrganizationId = useSelector(
    (state: RootState) => state.auth.selectedOrganizationId
  );
  const [open, setOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<any>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (memberships.length > 0) {
      if (selectedOrganizationId) {
        const membership = memberships.find(
          (m) => m.organizationId === selectedOrganizationId
        );
        setSelectedMembership(membership || memberships[0]);
        dispatch(setCurrentMember(membership as UserMembership));
      } else {
        setSelectedMembership(memberships[0]);
        dispatch(setSelectedOrganization(memberships[0].organizationId));
        dispatch(setCurrentMember(memberships[0]));
      }
    }
  }, [selectedOrganizationId, memberships, dispatch]);

  const handleSelectOrganization = (membership: UserMembership | null) => {
    if (membership) {
      dispatch(setSelectedOrganization(membership.organizationId));
      dispatch(setCurrentMember(membership));
      setSelectedMembership(membership);
      setOpen(false);
      router.push(membership.isAdmin ? "/dashboard" : "/member");
    }
  };

  if (memberships.length === 0) {
    return (
      <div>
        <p>Vous n&apos;avez pas encore d&apos;organisation.</p>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create or join an organization
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start">
            {selectedMembership ? (
              <span className="text-primary">
                {selectedMembership.organizationName}
              </span>
            ) : (
              "Sélectionner une organisation"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Rechercher une organisation..." />
              <CommandEmpty>Aucune organisation trouvée.</CommandEmpty>
              <CommandGroup>
                {memberships.map((membership) => (
                  <CommandItem
                    key={membership.organizationId}
                    onSelect={() => handleSelectOrganization(membership)}
                    className="flex justify-between items-center"
                  >
                    <span
                      className={
                        membership.organizationId === selectedOrganizationId
                          ? "text-primary"
                          : ""
                      }
                    >
                      {membership.organizationName}
                    </span>
                    {membership.organizationId === selectedOrganizationId && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </CommandItem>
                ))}
                <CommandItem onSelect={() => setIsCreateModalOpen(true)}>
                  <CreateOrganizationModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                  />
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
