import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectCurrentMember,
  selectSelectedOrganizationId,
} from "@/app/store/slices/authSlice";
import { createInvitation } from "@/api/services/organization";
import Link from "next/link";

const InviteInOrganization = () => {
  const [joinLink, setJoinLink] = useState<string>();
  const member = useSelector(selectCurrentMember);
  const organizationId = useSelector(selectSelectedOrganizationId);

  const createInvite = async () => {
    if (!organizationId) return;
    const response = await createInvitation(organizationId);
    setJoinLink(`http://${window.location.host}/join?orgId=${response.uuid}`);
  };

  useEffect(() => {
    createInvite();
  }, []);

  return (
    <div>
      {joinLink && (
        <h1>
          Invite Link : <Link href={joinLink}>{joinLink}</Link>
        </h1>
      )}
    </div>
  );
};

export default InviteInOrganization;
