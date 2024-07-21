import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { MembershipType } from "@/api/type";

interface SubscriptionFormProps {
  organizationId: number;
  membershipTypes: MembershipType[];
}

export const SubscriptionForm = ({
  organizationId,
  membershipTypes,
}: SubscriptionFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [selectedMembershipType, setSelectedMembershipType] = useState(
    membershipTypes[0].id
  );
  const [loading, setLoading] = useState(false);

  // ... (handleSubmit function)
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
      // Envoyer les informations de paiement à votre serveur pour traiter l'abonnement
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethodId: paymentMethod!.id,
          membershipTypeId: selectedMembershipType,
          organizationId,
        }),
      });

      if (response.ok) {
        // L'abonnement a été traité avec succès
        console.log("Subscription processed successfully");
      } else {
        console.error("Error processing subscription");
      }

      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Select
        value={selectedMembershipType.toString()}
        onValueChange={(value) => setSelectedMembershipType(Number(value))}
      >
        {membershipTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </Select>
      <CardElement />
      <Button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Subscribe"}
      </Button>
    </form>
  );
};
