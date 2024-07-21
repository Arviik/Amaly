"use client";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Organization } from "@/api/type";
import { OrganizationCard } from "@/components/public/nonProfitBoard/OrganizationCard";
import { getAllOrganizations } from "@/api/services/organization";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function NonprofitBoard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<
    Organization[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  const fetchOrganizations = useCallback(async () => {
    try {
      const data = await getAllOrganizations();
      setOrganizations(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch organizations",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  useEffect(() => {
    const filtered = organizations.filter((org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrganizations(filtered);
    setShowSuggestions(searchTerm.length > 0);
  }, [searchTerm, organizations]);

  return (
    <main className="flex flex-col min-h-screen">
      <section className="bg-primary text-primary-foreground p-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-justify">
                Make a Difference
                <br />
                Together
              </h1>
            </div>
            <div className="md:w-1/2">
              <p className="text-xl py-4">
                Find the organization that aligns with your values and get
                involved for a better world.
              </p>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for an organization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 pl-4 pr-12 rounded-full bg-background text-foreground"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-4 py-2 bg-secondary text-secondary-foreground">
                  Search
                </Button>
                {showSuggestions && (
                  <div className="absolute mt-2 w-full bg-background rounded-md shadow-lg  z-10">
                    {filteredOrganizations.map((org) => (
                      <Link key={org.id} href={`/organizations/${org.id}`}>
                        <p className="px-4 py-2 text-secondary-foreground hover:bg-muted">
                          {org.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-secondary-foreground">
            Explore inspiring non-profit organizations
          </h2>
          <p className="text-center text-secondary-foreground mb-8">
            Discover organizations that align with your values and get involved
            for a better world.
          </p>
          <div className="mb-12">
            <Carousel className="w-full">
              <CarouselContent>
                {organizations.map((org) => (
                  <CarouselItem
                    key={org.id}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1">
                      <OrganizationCard organization={org} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>
    </main>
  );
}
