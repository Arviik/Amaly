import { GetStaticProps, GetStaticPaths } from "next";
import {
  getAllOrganizations,
  getOrganizationById,
} from "@/api/services/organization";
import { Organization } from "@/api/type";
import { Button } from "@/components/ui/button";
import { Elements } from "@stripe/react-stripe-js";
import { DonationForm } from "../Donation/DonationForm";
import { Link } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

interface OrganizationDetailsPageProps {
  organization: Organization;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

export default function OrganizationDetailsPage({
  organization,
}: OrganizationDetailsPageProps) {
  if (stripePromise === null) {
    return <div>Stripe is not loaded</div>;
  }

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{organization.name}</h1>
      <p>{organization.description}</p>
      <Elements stripe={stripePromise}>
        <DonationForm organizationId={organization.id} />
      </Elements>
      <Link href={`/organizations/${organization.id}/subscribe`}>
        <Button>S&apos;inscrire</Button>
      </Link>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Récupérer les IDs de toutes les organisations
  const organizations = await getAllOrganizations();
  const paths = organizations.map((org) => ({
    params: { id: org.id.toString() },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const organizationId = Number(context.params?.id);
  const organization = await getOrganizationById(organizationId);

  return {
    props: { organization },
  };
};
