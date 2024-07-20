import { GetStaticProps, GetStaticPaths } from "next";
import {
  getAllOrganizations,
  getOrganizationById,
} from "@/api/services/organization";
import { Organization } from "@/api/type";
import { Button } from "@/components/ui/button";
import { Elements } from "@stripe/react-stripe-js";
import { DonationForm } from "./Donation/DonationForm";

interface OrganizationDetailsPageProps {
  organization: Organization;
}

const stripePromise = loadStripe("votre_clé_publique_Stripe");

export default function OrganizationDetailsPage({
  organization,
}: OrganizationDetailsPageProps) {
  return (
    <div>
      <h1>{organization.name}</h1>
      <p>{organization.description}</p>
      <Button>Faire un don</Button>
      <Button>S&apos;inscrire</Button>
      <Elements stripe={stripePromise}>
        <DonationForm organizationId={organization.id} />
      </Elements>
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
