import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/api/config";

interface DonationFormProps {
  organizationId: number;
}

export const DonationForm = ({ organizationId }: DonationFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement!,
    });

    if (error) {
      console.error("[error]", error);
      setLoading(false);
    } else {
      const response = await api.post("/api/donations", {
        json: {
          paymentMethodId: paymentMethod!.id,
          amount,
          organizationId,
          name,
          email,
        },
      });

      if (response.ok) {
        console.log("Donation processed successfully");
      } else {
        console.error("Error processing donation");
      }

      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Donation name"
        className="bg-input text-input-foreground mb-4"
      />
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Donation email"
        className="bg-input text-input-foreground mb-4"
      />

      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Donation amount"
        className="bg-input text-input-foreground mb-4"
      />
      <CardElement className="bg-input text-input-foreground p-4 rounded mb-4" />
      <Button
        type="submit"
        disabled={!stripe || loading}
        className="bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary"
      >
        {loading ? "Processing..." : "Donate"}
      </Button>
    </form>
  );
};
