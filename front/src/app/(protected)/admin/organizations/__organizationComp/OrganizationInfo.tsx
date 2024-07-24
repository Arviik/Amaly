import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Organization } from "@/api/type";

interface OrganizationInfoProps {
  organization: Organization;
}

export function OrganizationInfo({ organization }: OrganizationInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations Générales</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Description: {organization.description}</p>
        <p>
          Date de création:{" "}
          {new Date(organization.createdAt).toLocaleDateString()}
        </p>
        <p>Type: {organization.type}</p>
        <p>Adresse: {organization.address}</p>
        <p>Email: {organization.email}</p>
        <p>Téléphone: {organization.phone}</p>
        <p>
          Propriétaire: {organization.owner.firstName}{" "}
          {organization.owner.lastName}
        </p>
        <p>Email du propriétaire: {organization.owner.email}</p>
      </CardContent>
    </Card>
  );
}
