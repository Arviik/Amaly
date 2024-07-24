"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getMemberById } from "@/api/services/member";
import { Member } from "@/api/type";
import { MembershipTable } from "@/components/admin-asso/memberManage/MembershipTable";
import MemberTable from "@/components/admin-asso/memberManage/MemberTable";

export default function MemberDetailPage() {
  const { id } = useParams();
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const data = await getMemberById(Number(id));
        setMember(data);
      } catch (error) {
        console.error("Failed to fetch member:", error);
      }
    };
    fetchMember();
  }, [id]);

  if (!member) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Member Details</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Member Information</h2>
        <p>ID: {member.id}</p>
        <p>Role: {member.role}</p>
        <p>Is Admin: {member.isAdmin ? "Yes" : "No"}</p>
      </div>
      <MemberTable />
    </div>
  );
}
