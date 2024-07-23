"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { getOrganizationById } from "@/api/services/organization";
import { Organization, UserMembership } from "@/api/type";
import { RootState } from "@/app/store";
import {
  setSelectedOrganization,
  setCurrentMember,
} from "@/app/store/slices/authSlice";
import LoadingSpinner from "@/components/public/LoadingSpinner";
import { DonationDialog } from "@/components/public/nonProfitBoard/DonationDialog";
import { JoinOrganizationModal } from "@/components/public/nonProfitBoard/JoinOrganizationModal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/api/config";

export interface OrganizationDetailsPageProps {
  params: {
    Orgid: string;
  };
}

export default function OrganizationDetailsPage({
  params,
}: OrganizationDetailsPageProps) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isAlreadyMember, setIsAlreadyMember] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const memberships = useSelector((state: RootState) => state.auth.memberships);
  const router = useRouter();
  const dispatch = useDispatch();

  let paramsOrgid = parseInt(params.Orgid);

  useEffect(() => {
    const fetchOrganization = async () => {
      const data = await getOrganizationById(paramsOrgid);
      setOrganization(data);
    };

    fetchOrganization();

    // Vérifier si l'utilisateur est déjà membre
    if (user && memberships) {
      const isMember = memberships.some(
        (m) => m.organizationId === paramsOrgid
      );
      setIsAlreadyMember(isMember);
    }
  }, [params, user, memberships, paramsOrgid]);

  const handleJoinClick = () => {
    if (!user) {
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      router.push(`/login?redirect=/organizations/${params.Orgid}`);
    } else if (!isAlreadyMember) {
      // Si l'utilisateur est connecté mais n'est pas membre, ouvrir le modal
      setIsJoinModalOpen(true);
    }
  };

  const handleJoinSuccess = async () => {
    try {
      const response = await api.post(`organizations/${params.Orgid}/join`);

      if (response.ok) {
        const newMembership: UserMembership = await response.json();
        dispatch(setSelectedOrganization(newMembership.organizationId));
        dispatch(setCurrentMember(newMembership));
        toast({
          title: "Adhésion réussie",
          description: "Vous avez rejoint l'organisation avec succès.",
        });
        router.push("/member");
      }
    } catch (error) {
      console.error("Erreur lors de l'adhésion à l'organisation:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'adhésion à l'organisation.",
        variant: "destructive",
      });
    }
  };

  if (!organization) {
    return <LoadingSpinner />;
  }

  return (
    <div className=" bg-secondary min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            {organization.name}
          </h1>
          <p className="text-xl mb-8 text-gray-600">
            {organization.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InfoCard title="Type" content={organization.type} />
            <InfoCard title="Address" content={organization.address} />
            <InfoCard title="Phone" content={organization.phone} />
            <InfoCard title="Email" content={organization.email} />
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <DonationDialog
              organizationId={organization.id}
              organizationName={organization.name}
            />
            <Button
              onClick={handleJoinClick}
              variant="outline"
              disabled={isAlreadyMember}
            >
              {isAlreadyMember ? "Already Member" : "Join Organization"}
            </Button>
          </div>
        </div>
      </div>
      {user && !isAlreadyMember && (
        <JoinOrganizationModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          organizationId={organization.id}
          organizationName={organization.name}
          onJoin={handleJoinSuccess}
        />
      )}
    </div>
  );
}

const InfoCard = ({ title, content }: { title: string; content: string }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h2 className="text-lg font-semibold mb-2 text-primary">{title}</h2>
    <p className="text-gray-700">{content}</p>
  </div>
);
