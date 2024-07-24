"use client";
import React, {FormEvent, useEffect, useRef, useState} from "react";
import {createAGS, getAGSByOrganizationId} from "@/api/services/ags";
import {useSelector} from "react-redux";
import {selectCurrentMember} from "@/app/store/slices/authSlice";
import {AGs} from "@/api/type";
import Link from "next/link";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

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



const AG = () => {
    const member = useSelector(selectCurrentMember);
    const [AGList, setAGList] = useState<AGs[]>([])
    const router = useRouter()

    const loadAGs = async () => {
        console.log(member)
        if (!member) return;
        const response = await getAGSByOrganizationId(member.organizationId)
        setAGList(response)
        console.log(response)
    }

    useEffect(() => {
        loadAGs()
    }, []);

    return (
        <>
            <h1>Assemblé Générale</h1>
            {member?.isAdmin && <AGCreation></AGCreation>}
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