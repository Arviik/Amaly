"use client";
import React, {FormEvent, useEffect, useRef, useState} from "react";
import {createAGS, getAGSByOrganizationId} from "@/api/services/ags";
import {useSelector} from "react-redux";
import {selectCurrentMember} from "@/app/store/slices/authSlice";
import {AGs} from "@/api/type";
import Link from "next/link";

const AGCreation = () => {
    const titleRef = useRef<HTMLInputElement>(null);
    const agendaRef = useRef<HTMLTextAreaElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLSelectElement>(null);
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

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input ref={titleRef}  type="text" placeholder="Title" />
                <textarea ref={agendaRef} placeholder="Ordre du jour" />
                <input ref={dateRef} type="datetime-local"/>
                <select ref={typeRef}>
                    <option>ORDINARY</option>
                    <option>EXTRAORDINARY</option>
                </select>
                <button type="submit">SUBMIT FORM</button>
            </form>
        </div>
    )
}



const AG = () => {
    const member = useSelector(selectCurrentMember);
    const [AGList, setAGList] = useState<AGs[]>([])

    const loadAGs = async () => {
        if (!member) return;
        const response = await getAGSByOrganizationId(member.organizationId)
        setAGList(response)
    }

    useEffect(() => {
        loadAGs()
    }, []);

    return (
        <>
            <h1>AG Working!</h1>
            {member?.isAdmin ? <AGCreation></AGCreation> : null}
            {AGList.map((AG: AGs) => (
                <div key={AG.id} style={{border: "1px solid black"}}>
                    <Link href={`ag/${AG.id}`}>{AG.title}</Link>
                </div>
            ))}
        </>
    )
}

export default AG