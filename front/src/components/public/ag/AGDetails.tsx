"use client"

import Link from "next/link";
import {useEffect, useState} from "react";
import {AGs} from "@/api/type";
import {declareAttendance, getAGSById} from "@/api/services/ags";
import {useSelector} from "react-redux";
import {selectCurrentMember} from "@/app/store/slices/authSlice";

const AGDetails = ({id}: {id: string}) => {
    const [AG, setAG] = useState<AGs>();
    const member = useSelector(selectCurrentMember)

    const loadAG = async () => {
        const response = await getAGSById(Number(id))
        setAG(response)
    }

    const handleDeclarePresence = async () => {
        if (!member || !AG) return;
        const response = await declareAttendance(member.organizationId, {agId: AG.id})
        console.log(response)
    }

    useEffect(() => {
        loadAG()
    }, []);

    return (
        <div>
            <Link href={`/ag`}>Back</Link>
            <h1>AG Details</h1>
            <h1>{AG?.title}</h1>
            <h1>{AG?.description}</h1>
            <button onClick={handleDeclarePresence}>Je suis présent</button>
        </div>
    )
}

export default AGDetails