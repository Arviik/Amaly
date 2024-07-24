"use client";
import type { ConfettiRef } from "@/components/magicui/confetti";
import Confetti from "@/components/magicui/confetti";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";

export default function DonationSuccess() {
  const router = useRouter();
  const confettiRef = useRef<ConfettiRef>(null);

  const handleGoHome = () => {
    router.push("/");
  };

  useEffect(() => {
    // Déclencher le confetti automatiquement au chargement de la page
    confettiRef.current?.fire({});
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative">
      <div className="z-10">
        {" "}
        {/* Wrapper pour s'assurer que le contenu est au-dessus du confetti */}
        <h1 className="text-4xl font-bold mb-4">
          Thank You for Your Donation!
        </h1>
        <p className="text-xl mb-8">Your support means a lot to us.</p>
        <Button
          onClick={handleGoHome}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Return Home
        </Button>
      </div>
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 size-full"
        onMouseEnter={() => {
          confettiRef.current?.fire({});
        }}
      />
    </div>
  );
}
