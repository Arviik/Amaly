"use client";
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

  const handleSelectOrganization = (orgId: number) => {
    dispatch(setSelectedOrganization(orgId));
    const selectedMembership = memberships.find(
      (m) => m.organizationId === orgId
    );
    if (selectedMembership) {
      router.push(selectedMembership.isAdmin ? "/dashboard" : "/member");
    }
  };

  return (
    <div className=" mx-auto mt-10">
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
                  handleSelectOrganization(membership.organizationId)
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
