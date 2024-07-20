import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DonationFormProps {
  organizationId: number;
}

export const DonationForm = ({ organizationId }: DonationFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(0);
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
      // Envoyer les informations de paiement à votre serveur pour traiter le don
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethodId: paymentMethod!.id,
          amount,
          organizationId,
        }),
      });

      if (response.ok) {
        // Le don a été traité avec succès
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
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Donation amount"
      />
      <CardElement />
      <Button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Donate"}
      </Button>
    </form>
  );
};
