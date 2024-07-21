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

  useEffect(() => {
    console.log("Fetching organization with id:", params.Orgid);
    const fetchOrganization = async () => {
      const data = await getOrganizationById(params.Orgid);
      setOrganization(data);
    };

    fetchOrganization();
  }, [params]);

  if (stripePromise === null) {
    return <div>Stripe is not loaded</div>;
  }

  if (!organization) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{organization.name}</h1>
      <p className="text-lg mb-8">{organization.description}</p>
      <Elements stripe={stripePromise}>
        <DonationForm organizationId={organization.id} />
      </Elements>
      <Link href={`/organizations/${params.Orgid}/subscribe`}>
        <Button className="mt-8 bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary">
          Subscribe
        </Button>
      </Link>
    </div>
  );
}
