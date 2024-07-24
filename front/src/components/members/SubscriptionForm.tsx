import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/api/config";
import { MembershipType } from "@/api/type";
import { selectCurrentMember } from "@/app/store/slices/authSlice";
import { useSelector } from "react-redux";

interface SubscriptionFormProps {
  organizationId: number;
  onClose: () => void;
}

export const SubscriptionForm = ({
  organizationId,
  onClose,
}: SubscriptionFormProps) => {
  const [membershipTypes, setMembershipTypes] = useState<MembershipType[]>([]);
  const [selectedMembershipType, setSelectedMembershipType] =
    useState<MembershipType | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const currentMember = useSelector(selectCurrentMember);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const fetchMembershipTypes = async () => {
      try {
        const response = await api.get(
          `organization/${organizationId}/membershiptypes`
        );
        if (response.ok) {
          const data: MembershipType[] = await response.json();
          setMembershipTypes(data);
          if (data.length === 1) {
            setSelectedMembershipType(data[0]);
          }
        } else {
          throw new Error("Failed to fetch membership types");
        }
      } catch (error) {
        console.error("Error fetching membership types:", error);
        toast({
          title: "Error",
          description: "Failed to load membership types. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchMembershipTypes();
  }, [organizationId, toast]);

  if (!currentMember) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMembershipType || !isConfirmed) return;

    setLoading(true);

    try {
      const startDate = new Date();
      const endDate = new Date(
        startDate.getTime() +
          selectedMembershipType.duration * 30 * 24 * 60 * 60 * 1000
      ); // Assuming duration is in months

      const response = await api.post("subscriptions", {
        json: {
          memberId: currentMember.id,
          membershipTypeId: selectedMembershipType.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          PaymentStatus: "PENDING",
          stripeSubscriptionId: "",
        },
      });

      if (response.ok) {
        const data: any = await response.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          toast({
            title: "Success",
            description: "Subscription created successfully.",
          });
          onClose();
        }
      } else {
        throw new Error("Failed to create subscription");
      }
    } catch (error) {
      console.error("Error processing subscription:", error);
      toast({
        title: "Subscription Failed",
        description:
          "There was an error processing your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleButtonDisabledConditionChanged = () => {
    setIsButtonDisabled(isConfirmed);
  };

  return (
    <form onSubmit={handleSubmit}>
      {membershipTypes.length > 1 ? (
        <Select
          value={selectedMembershipType?.id.toString() || ""}
          onValueChange={(value) =>
            setSelectedMembershipType(
              membershipTypes.find((type) => type.id.toString() === value) ||
                null
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a membership type" />
          </SelectTrigger>
          <SelectContent>
            {membershipTypes.map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.name} - ${type.amount} / {type.duration} months
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : selectedMembershipType ? (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            {selectedMembershipType.name}
          </h3>
          <p>
            ${selectedMembershipType.amount} / {selectedMembershipType.duration}{" "}
            months
          </p>
        </div>
      ) : (
        <p>No membership types available</p>
      )}
      <div className="flex items-center space-x-2 mt-4">
        <Checkbox
          id="confirm"
          checked={isConfirmed}
          onCheckedChange={(checked) => {
            setIsConfirmed(checked as boolean);
            handleButtonDisabledConditionChanged();
          }}
        />
        <label
          htmlFor="confirm"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I confirm my choice to subscribe and agree to pay the amount
        </label>
      </div>
      <Button type="submit" disabled={isButtonDisabled} className="mt-4 w-full">
        {loading ? "Processing..." : "Subscribe"}
      </Button>
    </form>
  );
};
