import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {redirect, useRouter} from "next/navigation";
import { RootState } from "@/app/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {selectMemberships, setCurrentMember, setSelectedOrganization} from "@/app/store/slices/authSlice";
import { UserMembership } from "@/api/type";
import { Check } from "lucide-react"; // Assurez-vous d'avoir importé l'icône Check

export function ComboBox() {
  const dispatch = useDispatch();
  const router = useRouter();
  const memberships = useSelector(selectMemberships);
  const selectedOrganizationId = useSelector(
    (state: RootState) => state.auth.selectedOrganizationId
  );
  const [open, setOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] =
    useState<UserMembership | null>(null);

  useEffect(() => {
    if (memberships.length > 0) {
      if (selectedOrganizationId) {
        const membership = memberships.find(
          (m) => m.organizationId === selectedOrganizationId
        );
        setSelectedMembership(membership || memberships[0]);
        dispatch(setCurrentMember(membership || null))
      } else {
        setSelectedMembership(memberships[0]);
        dispatch(setSelectedOrganization(memberships[0].organizationId));
        dispatch(setCurrentMember(memberships[0] || null))
      }
    }
  }, [selectedOrganizationId, memberships, dispatch]);

  const handleCreateOrganization = () => {
    console.log("Ouvrir le formulaire de création d'organisation");
  };

  const handleSelectOrganization = (membership: UserMembership) => {
    dispatch(setSelectedOrganization(membership.organizationId));
    dispatch(setCurrentMember(membership))
    setSelectedMembership(membership);
    setOpen(false);
    router.push(membership.isAdmin ? "/dashboard" : "/member");
  };

  if (memberships.length === 0) {
    return (
      <div>
        <p>Vous n&apos;avez pas encore d&apos;organisation.</p>
        <Button onClick={handleCreateOrganization}>
          Créer une organisation
        </Button>
      </div>
    );
  }

  if (memberships.length === 1) {
    return (
      <div>
        <Button
          variant="outline"
          className="w-[200px] justify-start text-primary"
        >
          {memberships[0].organizationName}
        </Button>
        <Button onClick={handleCreateOrganization}>
          Créer une nouvelle organisation
        </Button>
      </div>
    );
  }

  return (
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
            </CommandGroup>
          </CommandList>
        </Command>
        <Button onClick={() => {
          router.push("/createorganization")}}>Créer une organisation</Button>
      </PopoverContent>
    </Popover>
  );
}
