import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { setSelectedOrganization } from "@/app/store/slices/authSlice";
import { UserMembership } from "@/api/type";

export function ComboBox() {
  const dispatch = useDispatch();
  const memberships = useSelector((state: RootState) => state.auth.memberships);
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
      } else {
        setSelectedMembership(memberships[0]);
        dispatch(setSelectedOrganization(memberships[0].organizationId));
      }
    }
  }, [selectedOrganizationId, memberships, dispatch]);

  const handleCreateOrganization = () => {
    // Implémentez ici la logique pour ouvrir le formulaire de création d'organisation
    console.log("Ouvrir le formulaire de création d'organisation");
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
        <Button variant="outline" className="w-[200px] justify-start">
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
          {selectedMembership
            ? selectedMembership.organizationName
            : "Sélectionner une organisation"}
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
                  onSelect={() => {
                    dispatch(
                      setSelectedOrganization(membership.organizationId)
                    );
                    setSelectedMembership(membership);
                    setOpen(false);
                  }}
                >
                  {membership.organizationName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
