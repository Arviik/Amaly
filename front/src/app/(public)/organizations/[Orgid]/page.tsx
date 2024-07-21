"use client";
import { useEffect, useState } from "react";
import { getOrganizationById } from "@/api/services/organization";
import { Organization } from "@/api/type";
import { Button } from "@/components/ui/button";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import LoadingSpinner from "@/components/public/LoadingSpinner";
import { DonationForm } from "@/app/Donation/page";
import Image from "next/image";

interface OrganizationDetailsPageProps {
  params: {
    Orgid: number;
  };
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

export default function OrganizationDetailsPage({
  params,
}: OrganizationDetailsPageProps) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrganization = async () => {
      const data = await getOrganizationById(params.Orgid);
      setOrganization(data);
    };

    fetchOrganization();
  }, [params]);

  if (stripePromise === null) {
    return <div className="text-center text-red-500">Stripe is not loaded</div>;
  }

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
            <Button
              onClick={() => setIsDonationModalOpen(true)}
              variant="default"
            >
              Donate
            </Button>
            <Button onClick={() => setIsJoinModalOpen(true)} variant="outline">
              Join Organization
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoCard = ({ title, content }: { title: string; content: string }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h2 className="text-lg font-semibold mb-2 text-primary">{title}</h2>
    <p className="text-gray-700">{content}</p>
  </div>
);
