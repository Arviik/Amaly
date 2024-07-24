"use client";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  selectMemberships,
  setCurrentMember,
  setSelectedOrganization,
} from "@/app/store/slices/authSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserMembership } from "@/api/type";

export default function SelectOrganization() {
  const router = useRouter();
  const dispatch = useDispatch();
  const memberships = useSelector(selectMemberships);

  const handleSelectOrganization = (orgId: number) => {
    dispatch(setSelectedOrganization(orgId));
    const selectedMembership: UserMembership | undefined = memberships.find(
      (m) => m.organizationId === orgId
    );

    if (!selectedMembership) return;

    if (selectedMembership) {
      dispatch(setCurrentMember(selectedMembership));
      console.log("je suis ici", selectedMembership);

      router.push(selectedMembership.isAdmin ? "/dashboard" : "/member");
    }
  };

  return (
    <div className=" mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Select an organization
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center ">
        {memberships.map((membership) => (
          <Card
            key={membership.id}
            className="flex flex-col items-center p-4 justify-center rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <CardHeader>
              <CardTitle>{membership.organizationName}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() =>
                  handleSelectOrganization(membership.organizationId)
                }
                className="w-full "
              >
                Select
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
