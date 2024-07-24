import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

export default function DonationCancel() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-4">Donation Canceled</h1>
      <p className="text-xl mb-8">
        Your subscription was not completed. If you encountered any issues,
        please try again.
      </p>
      <Button onClick={() => router.push("/member")}>Return to Home</Button>
    </div>
  );
}
