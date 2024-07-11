"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  selectMemberships,
  setSelectedOrganization,
} from "@/app/store/slices/authSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SelectOrganization() {
  const router = useRouter();
  const dispatch = useDispatch();
  const memberships = useSelector(selectMemberships);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSelectOrganization = (orgId: number, isAdmin: boolean) => {
    dispatch(setSelectedOrganization(orgId));
    // Utilisez setTimeout pour s'assurer que la navigation se produit après la mise à jour du state
    setTimeout(() => {
      router.push(isAdmin ? "/dashboard" : "/membres"); //regler le soucis ici
    }, 0);
  };

  if (!isClient) {
    return null; // ou un loader si vous préférez
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Sélectionnez une organisation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memberships.map((membership) => (
          <Card key={membership.id}>
            <CardHeader>
              <CardTitle>{membership.organizationName}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() =>
                  handleSelectOrganization(
                    membership.organizationId,
                    membership.isAdmin
                  )
                }
                className="w-full"
              >
                Sélectionner
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
