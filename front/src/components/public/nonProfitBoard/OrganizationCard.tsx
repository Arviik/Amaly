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
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>{organization.name}</CardTitle>
        <CardDescription>{organization.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/organizations/${organization.id}`}>
          <Button className="bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            Learn More
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
