"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface DetailsCompProps {
  entityName: string;
  entityId: number;
  header: React.ReactNode;
  tabs: {
    label: string;
    content: React.ReactNode;
  }[];
  sidebar: React.ReactNode;
  actions: {
    label: string;
    onClick: () => void;
  }[];
}

export function DetailsComp({
  entityName,
  entityId,
  header,
  tabs,
  sidebar,
  actions,
}: DetailsCompProps) {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm uppercase text-muted-foreground color-primary">
                {entityName}
              </div>
              <CardTitle>{header}</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Actions</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {actions.map((action) => (
                  <DropdownMenuItem
                    key={action.label}
                    onSelect={action.onClick}
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={tabs[0].label}>
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.label} value={tab.label}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab.label} value={tab.label}>
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Informations complémentaires</CardTitle>
        </CardHeader>
        <CardContent>{sidebar}</CardContent>
        <Button onClick={() => router.back()} className="m-2 ">
          Back
        </Button>
      </Card>
    </div>
  );
}
