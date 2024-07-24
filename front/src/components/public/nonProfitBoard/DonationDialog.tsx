import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/api/config";

interface DonationDialogProps {
  organizationId: number;
  organizationName: string;
}

export function DonationDialog({
  organizationId,
  organizationName,
}: DonationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [donationType, setDonationType] = useState<"one-time" | "recurring">(
    "one-time"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("amount", amount);

      const response = await api.post("donations", {
        json: {
          amount: parseFloat(amount) * 100,
          date: new Date().toISOString(),
          organizationId,
          donorName: name,
          donorEmail: email,

          recurring: donationType === "recurring",
        },
      });
      console.log("response", response);

      if (response.ok) {
        const data: any = await response.json();
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("Failed to create donation");
      }
    } catch (error) {
      console.error("Error processing donation:", error);
      toast({
        title: "Donation Failed",
        description:
          "There was an error processing your donation. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Donate</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Donate to {organizationName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="mb-4"
            required
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-4"
            required
          />
          <Tabs
            value={donationType}
            onValueChange={(value) =>
              setDonationType(value as "one-time" | "recurring")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="one-time">One-time</TabsTrigger>
              <TabsTrigger value="recurring">Recurring</TabsTrigger>
            </TabsList>
            <TabsContent value="one-time">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Donation Amount"
                className="mb-4"
                required
                min="1"
                step="0.01"
              />
            </TabsContent>
            <TabsContent value="recurring">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Monthly Donation Amount"
                className="mb-4"
                required
                min="1"
                step="0.01"
              />
            </TabsContent>
          </Tabs>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            {loading ? "Processing..." : "Submit Donation"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
