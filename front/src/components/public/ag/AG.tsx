"use client";
import React, {FormEvent, useEffect, useRef, useState} from "react";
import {createAGS, getAGSByOrganizationId} from "@/api/services/ags";
import {useSelector} from "react-redux";
import {selectCurrentMember} from "@/app/store/slices/authSlice";
import {AGs, Member} from "@/api/type";
import Link from "next/link";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {CreateModal, Field} from "@/components/common/CrudModals";

const AGCreation = () => {
    const titleRef = useRef<HTMLInputElement>(null);
    const agendaRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<any>(null);
    const [selectedType, setSelectedType] = useState<string>()
    const member = useSelector(selectCurrentMember);

    const handleSubmit = async (e: FormEvent) => {
        if (!member) return;
        e.preventDefault();
        console.log(dateRef.current?.value)
        await createAGS({
            title: titleRef.current?.value,
            description: agendaRef.current?.value,
            date: dateRef.current?.valueAsDate,
            type: typeRef.current?.value,
            organizationId: member.organizationId,
        })
    };

    const handleChange = () => {

    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Input ref={titleRef}  type="text" placeholder="Title" />
                <Input ref={agendaRef} placeholder="Ordre du jour" />
                <Input ref={dateRef} type="datetime-local"/>
                <Select
                    onValueChange={(value) => setSelectedType(value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={`Select Type`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ORDINARY">
                            ORDINARY
                        </SelectItem>
                        <SelectItem value="EXTRAORDINARY">
                            EXTRAORDINARY
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Button type="submit">Create AG</Button>
            </form>
        </div>
    )
}

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
        console.log(member)
        if (!member) return;
        const response = await getAGSByOrganizationId(member.organizationId)
        setAGList(response)
        console.log(response)
    }

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
        loadAGs()
    }, []);

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
            }}>
                <h1>Assemblé Générale</h1>
                {member?.isAdmin && <Button onClick={() => setCreateModalOpen(true)}>Organiser une Assemblé Générale</Button>}
            </div>
            <CreateModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreate}
                fields={fields}
                title="Create New Item"
            />
            {AGList.map((AG: AGs) => (
                <div key={AG.id} style={{border: "1px solid black"}}>
                    <h1>{AG.title}</h1>
                    <Button onClick={() => {router.push(`ag/${AG.id}`)}}>
                        Access Details</Button>
                </div>
            ))}
        </>
    )
}

export default AG