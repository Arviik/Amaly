import Link from "next/link";
import { Organization } from "@/api/type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OrganizationCardProps {
  organization: Organization;
}

export const OrganizationCard = ({ organization }: OrganizationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{organization.name}</CardTitle>
        <CardDescription>{organization.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/organizations/${organization.id}`}>
          <Button>En savoir plus</Button>
        </Link>
      </CardContent>
    </Card>
  );
};
