"use client";
import EditProfile from "@/components/members/EditProfile";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const SuperAdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">App Settings</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <EditProfile />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminSettingsPage;
