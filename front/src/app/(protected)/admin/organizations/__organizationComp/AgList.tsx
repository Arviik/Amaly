import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Ag {
  id: number;
  title: string;
  date: Date;
}

interface AgListProps {
  ags: Ag[];
}

export function AgList({ ags }: AgListProps) {
  if (!ags.length) {
    return <p>No Ags to display</p>;
  }
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {ags.map((ag) => (
              <TableRow key={ag.id}>
                <TableCell>{ag.title}</TableCell>
                <TableCell>{ag.date.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
