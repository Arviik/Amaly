"use client";
import { UserDetails } from "@/components/super-admin/User/UserDetails";
import { useParams } from "next/navigation";

const UserDetailPage = () => {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id);
  return (
    <div>
      <UserDetails id={id} />
    </div>
  );
};

export default UserDetailPage;
