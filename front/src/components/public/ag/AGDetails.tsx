"use client"

import Link from "next/link";
import React, {useCallback, useEffect, useState} from "react";
import {AGs, Member, User} from "@/api/type";
import {declareAgAttendance, getAGSById} from "@/api/services/ags";
import {useSelector} from "react-redux";
import {selectCurrentMember} from "@/app/store/slices/authSlice";
import {usePathname, useRouter} from "next/navigation";
import {DataTable} from "@/components/common/DataTable";
import {Field} from "@/components/common/CrudModals";
import {deleteMemberFromActivity, getMemberFromActivity} from "@/api/services/activity";
import {toast} from "@/components/ui/use-toast";
import {getUserName} from "@/api/services/user";
import {Button} from "@/components/ui/button";

const columns: { key: keyof (Member & Pick<User, "firstName" | "lastName">); header: string }[] = [
    {key: "firstName", header: "First Name" },
    {key: "lastName", header: "Last Name" },
];

const fields: Field[] = [
];


const AGDetails = ({id}: {id: string}) => {
    const [AG, setAG] = useState<AGs>();
    const member = useSelector(selectCurrentMember)
    const [members, setMembers] = useState<(Member & Pick<User, "firstName" | "lastName">)[]>([]);
    const pathname = usePathname()
    const router = useRouter()

    const handleDelete = async (id: number) => {
        try {
            if (!AG) return;
            await deleteMemberFromActivity(AG?.id, id);
            toast({
                title: "Success",
                description: "Member deleted successfully",
            });
            fetchMembers();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete member",
                variant: "destructive",
            });
        }
    };

    const fetchMembers = useCallback(async () => {
        console.log("ok")
        if (!AG?.organizationId) {
            toast({
                title: "Error",
                description: "No organization selected",
                variant: "destructive",
            });
            console.log("return")
            return;
        }
        try {
            const data = await getMemberFromActivity(AG.id);
            const membersFromActivity = data.map((object) => object.members)
            const membersList: (Member & Pick<User, "firstName" | "lastName">)[] = []
            for (const member of membersFromActivity) {
                console.log(member.id)
                const response = await getUserName(member.id)
                console.log(response)
                membersList.push({...member, firstName:  response.user.firstName, lastName: response.user.lastName})
            }
            console.log(membersList)
            setMembers(membersList);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch members",
                variant: "destructive",
            });
        }
    }, [AG, toast]);

    useEffect(() => {
        fetchMembers()
    }, [AG]);

    const loadAG = async () => {
        const response = await getAGSById(Number(id))
        setAG(response)
    }

    const handleDeclarePresence = async () => {
        if (!member || !AG) return;
        const response = await declareAgAttendance(member.organizationId, {agId: AG.id})
        console.log(response)
    }

    useEffect(() => {
        loadAG()
    }, []);

    return (
        <div>
            <Button onClick={() => {router.push(pathname.split('/').slice(0, pathname.split('/').length - 1).join('/'))}}>Back</Button>
            <h1>AG Details</h1>
            <h1>{AG?.title}</h1>
            <h1>{AG?.description}</h1>
            <Button onClick={handleDeclarePresence}>Je suis présent</Button>
            <hr/>
            {
                member?.isAdmin &&
                <div className="p-4 space-y-4">
                    <DataTable<(Member & Pick<User, "firstName" | "lastName">)>
                        data={members}
                        columns={columns}
                        onDelete={handleDelete}
                        fields={fields}
                        onCreate={() => {}}
                        onUpdate={() => {}}/>
                </div>

            }
        </div>
    )
}

export default AGDetails