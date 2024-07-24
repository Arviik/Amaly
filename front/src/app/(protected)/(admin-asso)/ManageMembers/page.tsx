"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectCurrentMember,
  selectSelectedOrganizationId,
} from "@/app/store/slices/authSlice";
import { createInvitation } from "@/api/services/organization";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiCopy, FiUserPlus } from "react-icons/fi";
import MemberTable from "@/components/admin-asso/memberManage/MemberTable";

const MembersPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Members Management
      </h1>
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Members List</TabsTrigger>
          <TabsTrigger value="invite">Invite Members</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>All Members</CardTitle>
            </CardHeader>
            <CardContent>
              <MemberTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invite">
          <InviteInOrganization />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const InviteInOrganization: React.FC = () => {
  const [joinLink, setJoinLink] = useState<string>("");
  const member = useSelector(selectCurrentMember);
  const organizationId = useSelector(selectSelectedOrganizationId);

  const createInvite = async () => {
    if (!organizationId) return;
    try {
      const response = await createInvitation(organizationId);
      setJoinLink(`http://${window.location.host}/join?orgId=${response.uuid}`);
    } catch (error) {
      console.error("Failed to create invitation:", error);
    }
  };

  useEffect(() => {
    createInvite();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(joinLink).then(() => {
      alert("Invite link copied to clipboard!");
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FiUserPlus className="mr-2" />
          Invite New Members
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500">
          Share this link with people you want to invite to your organization:
        </p>
        <div className="flex items-center space-x-2">
          <Input value={joinLink} readOnly className="flex-grow" />
          <Button variant="outline" onClick={copyToClipboard}>
            <FiCopy className="mr-2" />
            Copy
          </Button>
        </div>
        <Button onClick={createInvite} className="w-full">
          Generate New Invite Link
        </Button>
      </CardContent>
    </Card>
  );
};

export default MembersPage;
