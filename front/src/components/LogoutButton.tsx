"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authService } from "@/api/services/auth";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.push("/login");
  };

  return (
    <Button variant="destructive" onClick={handleLogout}>
      Déconnexion
    </Button>
  );
};

export default LogoutButton;
