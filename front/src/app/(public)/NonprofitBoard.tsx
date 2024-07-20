import { GetStaticProps } from "next";
import { getAllOrganizations } from "@/api/services/organization";
import { Organization } from "@/api/type";
import { OrganizationCard } from "@/components/public/nonProfitBoard/OrganizationCard";

interface NonprofitBoardPageProps {
  organizations: Organization[];
}

export default function NonprofitBoardPage({
  organizations,
}: NonprofitBoardPageProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {organizations.map((org) => (
        <OrganizationCard key={org.id} organization={org} />
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const organizations = await getAllOrganizations();
  return {
    props: { organizations },
  };
};
