"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { createAGS, getAGSByOrganizationId } from "@/api/services/ags";
import { useSelector } from "react-redux";
import { selectCurrentMember } from "@/app/store/slices/authSlice";
import { AGs , Member} from "@/api/type";
import Link from "next/link";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {CreateModal, Field} from "@/components/common/CrudModals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const AGCreation = () => {
  const [title, setTitle] = useState("");
  const [agenda, setAgenda] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<string>("");
  const member = useSelector(selectCurrentMember);

  const handleSubmit = async (e: FormEvent) => {
    if (!member) return;
    e.preventDefault();
    await createAGS({
      title,
      description: agenda,
      date,
      type: selectedType,
      organizationId: member.organizationId,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-8">
      <CardHeader>
        <CardTitle>Create New AG</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Title"
            className="w-full"
          />
          <Input
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
            placeholder="Ordre du jour"
            className="w-full"
          />

          <Select onValueChange={(value) => setSelectedType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select Type`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ORDINARY">ORDINARY</SelectItem>
              <SelectItem value="EXTRAORDINARY">EXTRAORDINARY</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full">
            Create AG
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const fields: Field[] = [
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Agenda", type: "text" },
    { name: "date", label: "Date", type: "datetime" },
    { name: "type", label: "Type", type: "select", options: ["ORDINARY","EXTRAORDINARY"] }
];

const AG = () => {
    const member = useSelector(selectCurrentMember);
    const [createModalOpen , setCreateModalOpen] = useState(false);
    const [AGList, setAGList] = useState<AGs[]>([])
    const router = useRouter()

  const loadAGs = async () => {
    if (!member) return;
    const response = await getAGSByOrganizationId(member.organizationId);
    setAGList(response);
  };

  const handleCreate = async (data: Partial<AGs>) => {
        if (!member) return;
        if (!data.type || !data.title || !data.description || !data.date) return;
        await createAGS({
            title: data.title,
            description: data.description,
            date: Date.parse(data.date),
            type: data.type,
            organizationId: member.organizationId,
        })
        setCreateModalOpen(false)
        loadAGs()
    }

    useEffect(() => {
        loadAGs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Assemblées Générales
      </h1>
        {member?.isAdmin && <Button onClick={() => setCreateModalOpen(true)}>Organiser une Assemblé Générale</Button>}
        <CreateModal
            isOpen={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreate}
            fields={fields}
            title="Create New Item"
        />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {AGList.map((AG: AGs) => (
          <Card
            key={AG.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-6">
              <Link
                href={`ag/${AG.id}`}
                className="text-xl font-semibold hover:underline"
              >
                {AG.title}
              </Link>
              <p className="text-sm text-gray-500 mt-2">
                {format(new Date(AG.date), "PPP")}
              </p>
              <p className="mt-2">{AG.description}</p>
              <div className="mt-4">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    AG.type === "ORDINARY"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {AG.type}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AG;
