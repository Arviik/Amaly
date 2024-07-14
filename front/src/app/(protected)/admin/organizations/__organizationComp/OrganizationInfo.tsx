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
        <p>Date de création: {organization.createdAt.toLocaleDateString()}</p>
        <p>Type: {organization.type}</p>
        <p>Adresse: {organization.address}</p>
        <p>Email: {organization.email}</p>
        <p>Téléphone: {organization.phone}</p>
        {/* <p>Contact principal: {organization.contactName}</p>
        <p>Email du contact: {organization.contactEmail}</p>
        <p>Téléphone du contact: {organization.contactPhone}</p> */}
      </CardContent>
    </Card>
  );
}
