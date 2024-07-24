import { AGs } from "@/api/type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AgListProps {
  ags: AGs[];
}

export function AgList({ ags }: AgListProps) {
  // if (!ags.length) {
  //   return <p>No Ags to display</p>;
  // }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assemblées Générales</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ags.map((ag) => (
              <TableRow key={ag.id}>
                <TableCell>{ag.title}</TableCell>
                <TableCell>{ag.date}</TableCell>
                <TableCell>{ag.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
