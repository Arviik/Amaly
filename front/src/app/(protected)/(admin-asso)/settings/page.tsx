"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MembershipTypesManager from "@/components/admin-asso/memberManage/MembershipTypesManager";
import EditProfile from "@/components/members/EditProfile";

const OrganizationSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Organization Settings</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="membershipTypes">Membership Types</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <EditProfile />
          </Card>
        </TabsContent>
        <TabsContent value="membershipTypes" className="p-4">
          <MembershipTypesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationSettingsPage;
